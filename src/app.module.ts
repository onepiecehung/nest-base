import * as redisStore from 'cache-manager-ioredis';

import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CacheModule as CacheModuleCore } from './cache/cache.module';
import { UuidMiddleware } from './middleware/uuid.middleware';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';
import { config, configValidationSchema } from './utils/config/config';
import { DatabaseConfig } from './utils/config/database.config';
import { HttpExceptionFilter } from './utils/filter/http-exception.filter';
import { TransformInterceptor } from './utils/interceptor/transform.interceptor';

import type { ClientOpts } from 'redis';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      store: redisStore,

      // Store-specific configuration:
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    TestModule,
    AuthModule,
    UsersModule,
    CacheModuleCore,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UuidMiddleware).forRoutes(AuthController);
  }
}
