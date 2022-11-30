import { MESSAGE_CODE } from 'src/utils/config/message.config';

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CacheService } from '../cache/cache.service';
import { FirebaseService } from '../firebase/firebase.service';
import { UserType } from '../users/entities/user.entity';
import {
  UserForgotPasswordDto,
  UserLogin,
  UserLoginSNSDto,
  UserRegister,
  UserVerifyPassAppDto,
  UserVerifyPassAppForgotPasswordDto,
} from '../users/users.dto';
import { UsersService } from '../users/users.service';
import { IVerifyInfo } from './auth.interface';
import { AppleAuthService } from './sns/apple-auth.service';
import { KaKaoAuthService } from './sns/kakao-auth.service';
import { NaverAuthService } from './sns/naver-auth.service';
import { PassAppAuthService } from './verify/passApp.verify';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private kaKaoAuthService: KaKaoAuthService,
    private appleAuthService: AppleAuthService,
    private naverAuthService: NaverAuthService,
    private passAppAuthService: PassAppAuthService,
    private firebaseService: FirebaseService,
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

  async loginSNS(userLoginSNSDto: UserLoginSNSDto, query: any) {
    try {
      const { uuid } = query;

      const userType: string = userLoginSNSDto.userType;
      const socialToken: string = userLoginSNSDto.socialToken;
      let verifyData: IVerifyInfo | any = null;
      switch (userType) {
        case UserType.Google:
          verifyData = await this.firebaseService.authenticate(socialToken);
          break;
        case UserType.Apple:
          verifyData = await this.appleAuthService.authenticate(socialToken);
          break;
        case UserType.Naver:
          verifyData = await this.naverAuthService.authenticate(socialToken);
          break;
        case UserType.Kakao:
          verifyData = await this.kaKaoAuthService.authenticate(socialToken);
          break;
        default:
          break;
      }

      if (verifyData?.error) {
        throw new UnauthorizedException();
      }

      verifyData.language = userLoginSNSDto.language;
      verifyData.userType = userType;
      verifyData.deviceToken = userLoginSNSDto.deviceToken;

      const user = await this.usersService.loginSNS(verifyData);

      const tokens = await this.gTokenLogin({
        userId: user.id,
        uuid: uuid,
      });

      // TODO: Add device token
      if (
        userLoginSNSDto.deviceToken &&
        userLoginSNSDto.deviceToken.length >= 15
      ) {
        await this.usersService.addDeviceToken(
          userLoginSNSDto.deviceToken,
          userLoginSNSDto.language,
          uuid,
          user,
        );
      }

      /**
       * Plz cmt this code if you use this src
       */
      const jwtDecodeA: any = await this.jwtDecode(tokens.accessToken);
      const jwtDecodeF: any = await this.jwtDecode(tokens.refreshToken);
      // console.log(jwtDecodeA.exp);
      Object.assign(tokens, {
        exp: {
          a: new Date(jwtDecodeA.exp * 1000).toISOString(),
          f: new Date(jwtDecodeF.exp * 1000).toISOString(),
        },
      });
      /**
       * Plz cmt this code if you use this src
       */
      return {
        user,
        tokens,
      };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async gTokenLogin(payload: any) {
    try {
      const { userId, uuid } = payload;

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.sign(
          { id: userId, _id: uuid },
          { expiresIn: '1h', algorithm: 'HS256' },
        ),
        this.jwtService.sign(
          { _id: uuid },
          { expiresIn: '365d', algorithm: 'HS512' },
        ),
      ]);
      await Promise.all([
        this.cacheService.set(`a_${uuid}`, userId, 60 * 60),
        this.cacheService.set(`r_${uuid}`, userId, 60 * 60 * 24 * 365),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async jwtDecode(token: string) {
    try {
      const data = await this.jwtService.decode(token);
      return data;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async logout(payload: any) {
    try {
      const { info } = payload;
      const { _id } = info;
      // console.log(_id);
      await Promise.all([
        this.cacheService.del(`a_${_id}`),
        this.cacheService.del(`r_${_id}`),
        this.usersService.logout(_id),
      ]);
      return {};
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async gAccessTokenViaRefToken(payload: any) {
    try {
      const { uuid } = payload;

      const userId = await this.cacheService.get(`r_${uuid}`);

      if (!userId) {
        throw new UnauthorizedException();
      }

      // console.log(userId);

      const accessToken = await this.jwtService.sign(
        { id: +userId, _id: uuid },
        { expiresIn: '1h', algorithm: 'HS256' },
      );

      await this.cacheService.set(`a_${uuid}`, userId, 60 * 60);

      return { accessToken };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async getAccessToken(payload: any) {
    try {
      // console.log(payload);
      const { info } = payload;
      const { _id } = info;

      const data = this.gAccessTokenViaRefToken({
        uuid: _id,
      });

      return data;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async register(userRegister: UserRegister) {
    try {
      // i don't know why this, don't have await before this function for get throw message :) fuk nest.js
      const user = this.usersService.register(userRegister);

      return user;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async login(userLogin: UserLogin, query: any) {
    // try {
    const { uuid } = query;
    // i don't know why this, don't have await before this function for get throw message :) fuk nest.js (remove try catch for working :))
    const user = await this.usersService.login(
      userLogin.email,
      userLogin.password,
    );
    const tokens = await this.gTokenLogin({
      userId: user.id,
      uuid: uuid,
    });

    // TODO: Add device token
    if (userLogin.deviceToken && userLogin.deviceToken.length >= 15) {
      await this.usersService.addDeviceToken(
        userLogin.deviceToken,
        userLogin.language,
        uuid,
        user,
      );
    }
    /**
     * Plz cmt this code if you use this src
     */
    const jwtDecodeA: any = await this.jwtDecode(tokens.accessToken);
    const jwtDecodeF: any = await this.jwtDecode(tokens.refreshToken);
    // console.log(jwtDecodeA.exp);
    Object.assign(tokens, {
      exp: {
        a: new Date(jwtDecodeA.exp * 1000).toISOString(),
        f: new Date(jwtDecodeF.exp * 1000).toISOString(),
      },
    });
    /**
     * Plz cmt this code if you use this src
     */

    return { user, tokens };
    // } catch (error) {
    //   throw new HttpException(error, error.status);
    // }
  }
  async verifyPassApp(userVerifyPassApp: UserVerifyPassAppDto, jwtDecode: any) {
    try {
      // console.log(jwtDecode);
      const checkImpUid = await this.usersService.passAppSession(
        userVerifyPassApp.impUid,
        userVerifyPassApp.merchantUid,
      );
      // return checkImpUid;

      if (checkImpUid) {
        throw new HttpException(
          {
            messageCode: MESSAGE_CODE.IMP_UID_USED,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const checkPassApp = await this.passAppAuthService.authenticate(
        userVerifyPassApp.impUid,
        userVerifyPassApp.merchantUid,
      );

      if (checkPassApp?.error) {
        throw new UnauthorizedException();
      }

      const uniqueKeyPassApp = checkPassApp?.response?.unique_key;
      const phoneNumber = checkPassApp.response?.phone
        ? checkPassApp.response?.phone
        : userVerifyPassApp.phoneNumber;
      const dob = checkPassApp.response?.birthday
        ? checkPassApp.response?.birthday
        : null;

      const name = checkPassApp.response?.name
        ? checkPassApp.response?.phone
        : `no name`;

      const user = await this.usersService.updatePassApp(
        uniqueKeyPassApp,
        phoneNumber,
        dob,
        name,
        jwtDecode,
      );

      await this.usersService.passAppSaveSession(
        userVerifyPassApp.impUid,
        userVerifyPassApp.merchantUid,
        user.id,
      );

      return { user };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async verifyPassAppToGetPassword(
    userVerifyPassAppForgotPasswordDto: UserVerifyPassAppForgotPasswordDto,
  ) {
    try {
      const checkImpUid = await this.usersService.passAppSession(
        userVerifyPassAppForgotPasswordDto.impUid,
        userVerifyPassAppForgotPasswordDto.merchantUid,
      );

      if (checkImpUid) {
        throw new HttpException(
          {
            messageCode: MESSAGE_CODE.IMP_UID_USED,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const checkPassApp = await this.passAppAuthService.authenticate(
        userVerifyPassAppForgotPasswordDto.impUid,
        userVerifyPassAppForgotPasswordDto.merchantUid,
      );

      if (checkPassApp?.error) {
        throw new UnauthorizedException();
      }

      const uniqueKeyPassApp = checkPassApp?.response?.unique_key;

      const data = await this.usersService.checkUniqueKeyPassApp(
        uniqueKeyPassApp,
        userVerifyPassAppForgotPasswordDto.email,
      );

      await this.usersService.passAppSaveSession(
        userVerifyPassAppForgotPasswordDto.impUid,
        userVerifyPassAppForgotPasswordDto.merchantUid,
        data.user.id,
      );
      await this.cacheService.set(data.uuid, data.user.email, 10 * 60);
      return { uuid: data.uuid };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async forgotPassword(userForgotPassword: UserForgotPasswordDto) {
    try {
      const data = await this.usersService.setPassUUID(
        userForgotPassword.password,
        userForgotPassword.uuid,
      );
      return data;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
