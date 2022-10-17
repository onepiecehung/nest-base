import { MESSAGE_CODE } from 'src/utils/config/message.config';
import { In, Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { AWSService } from '../aws/aws.service';
import { File, FileStatus } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private configService: ConfigService,
    private readonly awsService: AWSService,
  ) {}
  async uploadFiles(files: Array<Express.Multer.File>, jwtDecode: any) {
    try {
      // eslint-disable-next-line prefer-const
      let data: any[] = [];

      const { user } = jwtDecode;

      for await (const file of files) {
        const aws = await this.uploadFile(file, user);
        data.push(aws);
      }
      return { files: data };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async uploadFile(file: Express.Multer.File, user: any) {
    try {
      const uniqueSuffix = Math.round(Math.random() * 1e9);
      const fileName = `files/u/${user.id}/${Date.now()}_${uniqueSuffix}.${
        file.mimetype.split('/')[1]
      }`;

      const upload: any = await this.awsService.uploadFile(file, fileName);

      const fileData = {
        url: `${this.configService.get('AWS_CLOUDFRONT')}${upload.key}`,
        key: upload.key,
        path: upload.key,
        originalName: file.originalname,
        size: file.size,
        fileType: file.mimetype,
        user: user.id,
      };

      const data = await this.fileRepository.create(fileData);
      await this.fileRepository.save(data);
      return data;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async deleteFile(fileId: number, jwtDecode: any) {
    try {
      const { user } = jwtDecode;
      const { id } = user;
      const file = await this.fileRepository.findOne({
        where: {
          id: fileId,
          status: In([FileStatus.Active, FileStatus.Inactivate]),
          user: id,
        },
      });

      if (!file) {
        throw new HttpException(
          {
            messageCode: MESSAGE_CODE.FILE_NOT_FOUND,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await Promise.all([
        this.fileRepository.update(file.id, {
          status: FileStatus.Deleted,
        }),
        this.awsService.deleteFile(file.key),
      ]);

      return { message: 'Success' };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
