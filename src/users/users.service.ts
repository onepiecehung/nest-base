import { compare, genSaltSync, hashSync } from 'bcrypt';
import { FilesService } from 'src/files/files.service';
import { MESSAGE_CODE } from 'src/utils/config/message.config';
import { Language } from 'src/utils/constant/language.constant';
import { Pagination } from 'src/utils/interface/pagination.interface';
import { Like, Not, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CacheService } from '../cache/cache.service';
import { File, FileStatus } from '../files/entities/file.entity';
import { StepRegister, User, UserStatus } from './entities/user.entity';
import { UserDevice, UserDeviceStatus } from './entities/userDevice.entity';
import { UserPassApp, UserPassAppStatus } from './entities/userPassApp.entity';
import { GetUsersDto, UserRegister, UserUpdateProfile } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(File)
    private fileRepository: Repository<File>,

    @InjectRepository(UserDevice)
    private userDeviceRepository: Repository<UserDevice>,

    @InjectRepository(UserPassApp)
    private userPassAppRepository: Repository<UserPassApp>,

    private cacheService: CacheService,

    private readonly fileService: FilesService,
  ) {}

  async loginSNS({ socialId, userType, language, deviceToken }): Promise<User> {
    let user = await this.userRepository.findOne({
      select: {
        avatar: {
          url: true,
          id: true,
        },
      },
      where: {
        socialId,
        userType,
      },
      relations: {
        avatar: true,
      },
    });

    if (!user) {
      user = this.userRepository.create({
        socialId,
        userType,
        stepRegister: StepRegister.verifiedPASSApp,
      });
      await this.userRepository.save(user);
    }
    // // Todo: update username
    // await this.userRepository.update(user.id, {
    //   username: `username_${socialId}`,
    // });
    return user;
  }

  async findUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        select: {
          id: true,
        },
        where: {
          username: username,
        },
      });
      // console.log(user);
      return { isExists: user ? true : false };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async findEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        select: {
          id: true,
        },
        where: {
          email: email,
        },
      });

      return { isExists: user ? true : false };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async register(userRegister: UserRegister) {
    try {
      const [email, username] = await Promise.all([
        this.findEmail(userRegister.email),
        this.findUsername(userRegister.username),
      ]);

      if (email.isExists) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.EMAIL_EXIST },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (username.isExists) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.USERNAME_EXIST },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userRepository.create({
        email: userRegister.email,
        password: userRegister.password,
        username: userRegister.username,
        stepRegister: StepRegister.verifiedPASSApp,
      });

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const checkEmail = await this.findEmail(email);
      if (!checkEmail.isExists) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.EMAIL_NOT_FOUND },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userRepository.findOne({
        select: {
          avatar: {
            url: true,
            id: true,
          },
        },
        where: {
          email: email,
          status: Not(UserStatus.Removed),
        },
        relations: {
          avatar: true,
        },
      });

      if (!user || user.status !== UserStatus.Active) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.USER_NOT_FOUND },
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await compare(password, user.password);

      if (!isMatch) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.PASSWORD_INCORRECT },
          HttpStatus.BAD_REQUEST,
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async myProfile(jwtDecode: any): Promise<{ user: User }> {
    try {
      const { info } = jwtDecode;
      const { id } = info;
      const user = await this.userRepository.findOne({
        select: {
          avatar: {
            url: true,
            id: true,
          },
        },
        where: {
          id: id,
          status: Not(UserStatus.Removed),
        },
        relations: {
          avatar: true,
        },
      });

      return { user };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async updateUsername(
    username: string,
    jwtDecode: any,
  ): Promise<{ user: User }> {
    try {
      const { info } = jwtDecode;
      const { id } = info;
      // eslint-disable-next-line prefer-const
      let user = await this.userRepository.findOne({
        where: {
          id: id,
          status: Not(UserStatus.Removed),
        },
      });

      if (!user || user.status !== UserStatus.Active) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.USER_NOT_FOUND },
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkUsername = await this.findUsername(username);

      if (checkUsername.isExists) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.USERNAME_EXIST },
          HttpStatus.BAD_REQUEST,
        );
      }
      user.username = username;
      // await this.userRepository.update(user.id, {
      //   username: username,
      // });
      await this.userRepository.save(user);
      // user = await this.userRepository.findOne({
      //   where: {
      //     id: id,
      //     status: Not(UserStatus.Removed),
      //   },
      // });
      return { user };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async updateProfile(
    payload: UserUpdateProfile,
    jwtDecode: any,
  ): Promise<{ user: User }> {
    try {
      const { info } = jwtDecode;
      const { id } = info;

      let oldAvatarId = null;
      const user = await this.userRepository.findOne({
        select: {
          avatar: {
            url: true,
            id: true,
          },
        },
        where: {
          id: id,
          status: Not(UserStatus.Removed),
        },
        relations: {
          avatar: true,
        },
      });

      // return { user };

      if (!user || user.status !== UserStatus.Active) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.USER_NOT_FOUND },
          HttpStatus.BAD_REQUEST,
        );
      }

      const {
        username,
        introduction,
        avatar,
        receiveNotification,
        receiveNotificationMarketing,
      } = payload;

      if (username) {
        const checkUsername = await this.findUsername(username);

        if (checkUsername.isExists) {
          throw new HttpException(
            { messageCode: MESSAGE_CODE.USERNAME_EXIST },
            HttpStatus.BAD_REQUEST,
          );
        }
        user.username = username;
      }

      if (introduction) {
        user.introduction = introduction;
      }

      // console.log(receiveNotification);

      if (receiveNotification == false || receiveNotification == true) {
        user.receiveNotification = receiveNotification;
      }

      if (
        receiveNotificationMarketing == false ||
        receiveNotificationMarketing == true
      ) {
        user.receiveNotificationMarketing = receiveNotificationMarketing;
      }

      if (avatar && avatar.id) {
        const checkFile = await this.fileRepository.findOne({
          where: { id: avatar.id, status: FileStatus.Inactivate },
        });

        if (!checkFile) {
          throw new HttpException(
            { messageCode: MESSAGE_CODE.FILE_NOT_FOUND },
            HttpStatus.BAD_REQUEST,
          );
        }
        checkFile.status = FileStatus.Active;

        await this.fileRepository.save(checkFile);

        // todo: remove old avatar if exists
        if (user.avatar && user.avatar.id) {
          oldAvatarId = user.avatar.id;
        }
        user.avatar = avatar;
      }

      await this.userRepository.save(user);

      // // TODO: delete old avatar
      if (oldAvatarId) {
        // console.log(oldAvatarId);
        const checkFileDelete = await this.fileRepository.findOne({
          where: {
            id: oldAvatarId,
            status: FileStatus.Active,
          },
        });

        if (checkFileDelete) {
          checkFileDelete.status = FileStatus.Deleted;
          await Promise.all([
            this.fileRepository.save(checkFileDelete),
            this.fileService.deleteFile(checkFileDelete.id, jwtDecode),
          ]);
        }
      }

      return { user };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async addDeviceToken(
    deviceToken: string,
    language: Language = Language.Kor,
    uuid: string,
    user: User,
  ): Promise<boolean> {
    try {
      console.log('addDeviceToken');
      const checkUserDevice = await this.userDeviceRepository.findOne({
        where: {
          deviceToken: deviceToken,
          status: UserDeviceStatus.Active,
        },
      });
      // console.log(checkUserDevice);

      if (!checkUserDevice) {
        const userDevice = await this.userDeviceRepository.create({
          deviceToken: deviceToken,
          uuid: uuid,
          user: user,
          language: language,
        });
        await this.userDeviceRepository.save(userDevice);
      } else {
        checkUserDevice.deviceToken = deviceToken;
        checkUserDevice.language = language;
        checkUserDevice.uuid = uuid;
        await this.userDeviceRepository.save(checkUserDevice);
      }
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  async updatePassApp(
    uniqueKeyPassApp: string,
    phoneNumber: string,
    dob: string,
    name: string,
    jwtDecode: any,
  ): Promise<any> {
    try {
      const checkPassAppKey = await this.userRepository.findOne({
        where: {
          uniqueKeyPassApp: uniqueKeyPassApp,
        },
      });

      if (checkPassAppKey) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.PHONE_NUMBER_IS_ALREADY_VERIFY_PASS_APP },
          HttpStatus.BAD_REQUEST,
        );
      }
      const { info } = jwtDecode;
      const { id } = info;

      const user = await this.userRepository.findOne({
        select: {
          avatar: {
            url: true,
            id: true,
          },
        },
        where: {
          id: id,
          status: Not(UserStatus.Removed),
        },
        relations: {
          avatar: true,
        },
      });

      user.stepRegister = StepRegister.registered;
      user.uniqueKeyPassApp = uniqueKeyPassApp;
      user.phoneNumber = phoneNumber;
      user.name = name;
      if (dob) {
        user.dob = new Date(dob);
      }

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      // console.log(error);
      throw new HttpException(error, error.status);
    }
  }

  async passAppSession(impUid: string, merchantUid: string): Promise<boolean> {
    try {
      const checkImpUid = await this.userPassAppRepository.findOne({
        where: {
          impUid: impUid,
        },
      });

      if (!checkImpUid) {
        return false;
      }
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  async passAppSaveSession(
    impUid: string,
    merchantUid: string,
    userId: number,
  ): Promise<void> {
    try {
      const passAppSession = await this.userPassAppRepository.create({
        impUid: impUid,
        merchantUid: merchantUid,
        status: UserPassAppStatus.Used,
        userId: userId,
      });

      await this.userPassAppRepository.save(passAppSession);
    } catch (error) {
      console.log(error);
    }
  }

  async checkUniqueKeyPassApp(uniqueKeyPassApp: string, email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
          uniqueKeyPassApp: uniqueKeyPassApp,
        },
      });

      if (!user || user.status !== UserStatus.Active) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.USER_NOT_FOUND },
          HttpStatus.BAD_REQUEST,
        );
      }
      const uuid = uuidv4();
      return { user, uuid: uuid };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async setPassUUID(password: string, uuid: string) {
    try {
      const checkUUID = await this.cacheService.get(uuid);
      if (!checkUUID) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.SESSION_FORGOT_PASSWORD_END },
          HttpStatus.BAD_REQUEST,
        );
      }
      // console.log(checkUUID);
      // const newPassword;

      const user = await this.userRepository.findOne({
        where: {
          email: checkUUID,
        },
      });

      if (!user || user.status !== UserStatus.Active) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.USER_NOT_FOUND },
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await compare(password, user.password);

      if (isMatch) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.PASSWORD_NOT_SAME_OLD_PASSWORD },
          HttpStatus.BAD_REQUEST,
        );
      }
      const salt = genSaltSync(10);
      password = hashSync(password, salt);
      user.password = password;

      await Promise.all([
        this.userRepository.save(user),
        this.cacheService.del(uuid),
      ]);

      return { user };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async logout(uuid: string) {
    try {
      const device = await this.userDeviceRepository.findOne({
        where: {
          uuid: uuid,
        },
      });
      device.status = UserDeviceStatus.Logout;
      await this.userDeviceRepository.save(device);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserById(userId: number, jwtDecode: any) {
    const { user } = jwtDecode;
    const { id } = user;
    try {
      const userData = await this.userRepository.findOne({
        select: {
          id: true,
          createdAt: true,
          username: true,
          totalFollowers: true,
          totalFollowing: true,
          introduction: true,
          blocked: true,
          followed: true,
          avatar: {
            id: true,
            url: true,
          },
        },
        where: { id: userId, status: UserStatus.Active },
        relations: {
          avatar: true,
        },
      });

      if (!userData) {
        throw new HttpException(
          { messageCode: MESSAGE_CODE.USER_NOT_FOUND },
          HttpStatus.BAD_REQUEST,
        );
      }

      return { user: userData };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async searchUsers(getUsersDto: GetUsersDto, jwtDecode: any) {
    try {
      const { page, limit, order, username } = getUsersDto;
      const skip = (page - 1) * limit;

      const where: any = { status: UserStatus.Active };

      if (username) {
        Object.assign(where, {
          username: Like(`%${username}%`),
        });
      }

      // console.log(getUsersDto);

      const [inquiries, total] = await this.userRepository.findAndCount({
        select: {
          id: true,
          createdAt: true,
          username: true,
          totalFollowers: true,
          totalFollowing: true,
          introduction: true,
          avatar: {
            id: true,
            url: true,
          },
        },
        where: where,
        relations: {
          avatar: true,
        },
        take: limit,
        skip: skip,
        order: { createdAt: order },
      });

      const result = Pagination.create(inquiries, total, page, limit);
      return result;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
