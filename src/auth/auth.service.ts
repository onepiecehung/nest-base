import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CacheService } from '../cache/cache.service';
import { UserType } from '../users/entities/user.entity';
import { UserLoginSNSDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import { IVerifyInfo } from './auth.interface';
import { AppleAuthService } from './sns/apple-auth.service';
import { KaKaoAuthService } from './sns/kakao-auth.service';
import { NaverAuthService } from './sns/naver-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private kaKaoAuthService: KaKaoAuthService,
    private appleAuthService: AppleAuthService,
    private naverAuthService: NaverAuthService,
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
        //   case UserType.Google:
        //     verifyData = await this.firebaseService.authenticate(socialToken);
        //     break;
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

      return {
        user,
        tokens,
      };
    } catch (error) {
      return error;
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
      return error;
    }
  }

  async logout(payload: any) {
    try {
      const { info } = payload;
      const { _id } = info;
      console.log(_id);
      await Promise.all([
        this.cacheService.del(`a_${_id}`),
        this.cacheService.del(`r_${_id}`),
      ]);
      return {};
    } catch (error) {
      return error;
    }
  }
}
