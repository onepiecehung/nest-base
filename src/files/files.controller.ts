import { Request } from 'express';
import { ANY_PERMISSION } from 'src/auth/permission/permission';
import { Auth } from 'src/utils/decorators/auth.decorator';

import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Auth(ANY_PERMISSION)
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    const data = await this.filesService.uploadFiles(files, req.user);
    return data;
  }

  @Delete(':id')
  @Auth(ANY_PERMISSION)
  async deleteFile(@Param('id') id: string, @Req() req: Request) {
    const data = await this.filesService.deleteFile(+id, req.user);
    return data;
  }
}
