import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ANY_PERMISSION } from 'src/auth/permission/permission';
import { Auth } from 'src/utils/decorators/auth.decorator';

import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  GetUsersDto,
  UserUpdateProfile,
  UserUpdateUsername,
} from './users.dto';
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

  @Get('search')
  @Auth(ANY_PERMISSION)
  async searchUsers(@Query() getUsersDto: GetUsersDto, @Req() req: Request) {
    const data = await this.usersService.searchUsers(getUsersDto, req.user);
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
      const data = await this.usersService.findEmail(query.email);
      return data;
    }

    return { isExists: false };
  }

  @Get(':id')
  @Auth(ANY_PERMISSION)
  async getUserById(@Param('id') userId: string, @Req() req: Request) {
    const data = await this.usersService.getUserById(+userId, req.user);
    return data;
  }
}
