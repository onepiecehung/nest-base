import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAccessFrequency } from 'src/users/entities/userAccessFrequency.entity';
import { MESSAGE_CODE } from 'src/utils/config/message.config';
import { getStartDayAndEndDay } from 'src/utils/decorators/date.decorator';
import { Between, Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { CacheService } from '../../cache/cache.service';
import { StepRegister, User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cacheService: CacheService,
    private configService: ConfigService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(UserAccessFrequency)
    private userAccessFrequencyRepository: Repository<UserAccessFrequency>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { id, _id } = payload;
    if (!id) {
      throw new UnauthorizedException();
    }

    const checkToken = await this.cacheService.get(`a_${_id}`);

    // console.log(checkToken);

    if (!checkToken) {
      throw new UnauthorizedException();
    }
    const userData = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    // console.log(userData);

    if (userData.stepRegister !== StepRegister.registered) {
      throw new HttpException(
        {
          messageCode: MESSAGE_CODE.USER_NOT_COMPLETED_REGISTRATION,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    //TODO: save user access frequency
    await this.userAccessFrequency(userData);

    return { user: userData, info: payload };
  }

  async userAccessFrequency(user: any) {
    const [startOfDay, endOfDay] = getStartDayAndEndDay(new Date());

    const userAccessFrequency =
      await this.userAccessFrequencyRepository.findOne({
        where: {
          date: Between(startOfDay, endOfDay),
          userId: +user.id,
        },
      });

    if (userAccessFrequency) {
      await this.userAccessFrequencyRepository.increment(
        { id: userAccessFrequency.id },
        'totalAccess',
        1,
      );
    } else {
      const newAccess = await this.userAccessFrequencyRepository.create({
        date: new Date(),
        userId: +user.id,
        user: user,
      });
      await this.userAccessFrequencyRepository.save(newAccess);
    }

    return true;
  }
}
