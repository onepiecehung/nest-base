import { compare } from 'bcrypt';
import { FilesService } from 'src/files/files.service';
import { MESSAGE_CODE } from 'src/utils/config/message.config';
import { Language } from 'src/utils/constant/language.constant';
import { DataSource, Not, Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { File, FileStatus } from '../files/entities/file.entity';
import { User, UserStatus } from './entities/user.entity';
import { UserDevice } from './entities/userDevice.entity';
import { UserRegister, UserUpdateProfile } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(File)
    private fileRepository: Repository<File>,

    @InjectRepository(UserDevice)
    private userDeviceRepository: Repository<UserDevice>,

    private readonly fileService: FilesService,
    private dataSource: DataSource,
  ) {}

  async loginSNS({ socialId, userType, language, deviceToken }): Promise<User> {
    let user = await this.userRepository.findOne({
      where: {
        socialId,
        userType,
      },
    });

    if (!user) {
      user = this.userRepository.create({
        socialId,
        userType,
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
        where: {
          email: email,
          status: Not(UserStatus.Removed),
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

      const { username, introduction, avatar } = payload;

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
        },
      });
      console.log(checkUserDevice);

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
      console.log(error);
      return false;
    }
  }
}
