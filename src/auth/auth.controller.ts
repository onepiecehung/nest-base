import { Request } from 'express';

import { Body, Controller, Post, Req, UseGuards, Put } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserLoginSNSDto } from '../users/users.dto';
import { AuthService } from './auth.service';

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

  @Put('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    const data = await this.authService.logout(req.user);
    return data;
  }
}
