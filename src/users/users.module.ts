import { CacheService } from 'src/cache/cache.service';
import { File } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AWSModule } from '../aws/aws.module';
import { User } from './entities/user.entity';
import { UserDevice } from './entities/userDevice.entity';
import { UserPassApp } from './entities/userPassApp.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, File, UserDevice, UserPassApp]),
    ClientsModule.registerAsync([
      {
        name: 'WORKER_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('RABBIT_HOST')}`],
            queue: configService.get('RABBIT_QUEUE'),
            noAck: false,
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    AWSModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, FilesService, CacheService],
  exports: [UsersService],
})
export class UsersModule {}
