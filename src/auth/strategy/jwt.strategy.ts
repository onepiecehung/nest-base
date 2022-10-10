import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../users/entities/user.entity';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cacheService: CacheService,
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    console.log(checkToken);

    if (!checkToken) {
      throw new UnauthorizedException();
    }
    const userData = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    // console.log('validate jwt', userData);
    return { user: userData, info: payload };
  }
}
