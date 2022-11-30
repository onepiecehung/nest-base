import { Request } from 'express';

import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../auth/guard/jwt-refresh-auth.guard';
import {
  UserForgotPasswordDto,
  UserLogin,
  UserLoginSNSDto,
  UserRegister,
  UserVerifyPassAppDto,
  UserVerifyPassAppForgotPasswordDto,
} from '../users/users.dto';
import { AuthService } from './auth.service';
import { JwtPassAppAuthGuard } from './guard/jwt-pass-app-auth.guard';

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

  @Put('pass-app')
  @UseGuards(JwtPassAppAuthGuard)
  async verifyPassApp(
    @Body() userVerifyPassAppDto: UserVerifyPassAppDto,
    @Req() req: Request,
  ) {
    const data = await this.authService.verifyPassApp(
      userVerifyPassAppDto,
      req.user,
    );
    return data;
  }

  @Put('pass-app-pw')
  async verifyPassAppToGetPassword(
    @Body()
    userVerifyPassAppForgotPasswordDto: UserVerifyPassAppForgotPasswordDto,
  ) {
    const data = await this.authService.verifyPassAppToGetPassword(
      userVerifyPassAppForgotPasswordDto,
    );
    return data;
  }

  @Put('forgot-password')
  async forgotPassword(
    @Body()
    userForgotPassword: UserForgotPasswordDto,
  ) {
    const data = await this.authService.forgotPassword(userForgotPassword);
    return data;
  }
}
