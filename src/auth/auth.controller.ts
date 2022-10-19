import { Request } from 'express';

import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../auth/guard/jwt-refresh-auth.guard';
import { UserLogin, UserLoginSNSDto, UserRegister } from '../users/users.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('loginSNS')
  async loginSNS(
    @Body() userLoginSNSDto: UserLoginSNSDto,
    @Req() req: Request,
  ) {
    const data = await this.authService.loginSNS(userLoginSNSDto, req.query);
    return data;
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLogin, @Req() req: Request) {
    const data = await this.authService.login(userLoginDto, req.query);
    return data;
  }

  @Post('register')
  async register(@Body() userRegister: UserRegister) {
    const data = await this.authService.register(userRegister);
    return data;
  }

  @Put('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    const data = await this.authService.logout(req.user);
    return data;
  }

  @Post('accessToken')
  @UseGuards(JwtRefreshAuthGuard)
  async getAccessToken(@Req() req: Request) {
    const data = await this.authService.getAccessToken(req.user);
    return data;
  }
}
