import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { CacheService } from '../../cache/cache.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
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
    if (id) {
      throw new UnauthorizedException();
    }

    const checkToken = await this.cacheService.get(`r_${_id}`);

    // console.log(checkToken);

    if (!checkToken) {
      throw new UnauthorizedException();
    }

    const userData = await this.userRepository.findOne({
      where: {
        id: +checkToken,
      },
    });
    // console.log('validate jwt', userData);
    return { user: userData, info: payload };
  }
}
