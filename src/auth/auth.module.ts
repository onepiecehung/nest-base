import { UserAccessFrequency } from 'src/users/entities/userAccessFrequency.entity';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheService } from '../cache/cache.service';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AxiosService } from '../utils/http/axios.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppleAuthService } from './sns/apple-auth.service';
import { KaKaoAuthService } from './sns/kakao-auth.service';
import { NaverAuthService } from './sns/naver-auth.service';
import { JwtPassAppStrategy } from './strategy/jwt-pass-app.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassAppAuthService } from './verify/passApp.verify';

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
    TypeOrmModule.forFeature([User, UserAccessFrequency]),
  ],
  providers: [
    AuthService,
    AxiosService,
    KaKaoAuthService,
    AppleAuthService,
    NaverAuthService,
    PassAppAuthService,
    FirebaseService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtPassAppStrategy,
    CacheService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
