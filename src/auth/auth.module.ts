import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheService } from '../cache/cache.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AxiosService } from '../utils/http/axios.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppleAuthService } from './sns/apple-auth.service';
import { KaKaoAuthService } from './sns/kakao-auth.service';
import { NaverAuthService } from './sns/naver-auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    AxiosService,
    KaKaoAuthService,
    AppleAuthService,
    NaverAuthService,
    JwtStrategy,
    CacheService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
