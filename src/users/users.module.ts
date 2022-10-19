import { File } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AWSModule } from '../aws/aws.module';
import { User } from './entities/user.entity';
import { UserDevice } from './entities/userDevice.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, File, UserDevice]), AWSModule],
  controllers: [UsersController],
  providers: [UsersService, FilesService],
  exports: [UsersService],
})
export class UsersModule {}
