import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserUpdateProfile, UserUpdateUsername } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async myProfile(@Req() req: Request) {
    const data = await this.usersService.myProfile(req.user);
    return data;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() updateProfile: UserUpdateProfile,
    @Req() req: Request,
  ) {
    const data = await this.usersService.updateProfile(updateProfile, req.user);
    return data;
  }

  @Put('username')
  @UseGuards(JwtAuthGuard)
  async updateUsername(
    @Body() updateUsername: UserUpdateUsername,
    @Req() req: Request,
  ) {
    const data = await this.usersService.updateUsername(
      updateUsername.username,
      req.user,
    );
    return data;
  }

  @Get('find')
  // @Auth(ANY_PERMISSION)
  async find(@Query() query: any) {
    if (query?.username) {
      const data = await this.usersService.findUsername(query.username);
      return data;
    }

    if (query?.email) {
      const data = await this.usersService.findUsername(query.email);
      return data;
    }

    return { isExists: false };
  }
  // async findEmail(@Query('email') email: string) {
  //   const data = await this.usersService.findEmail(email);
  //   return data;
  // }
}
