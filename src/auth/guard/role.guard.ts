import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles: any = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    if (typeof roles[0] === 'object') roles = roles[0];

    const request = context.switchToHttp().getRequest<Request>();

    const data: any = request.user;

    // console.log(request.user);

    const { user } = data;

    if (roles.includes(UserRole.Any)) {
      return true;
    }

    // console.log(roles, user.role);

    const isAuthorized = roles.includes(user.role);

    if (!isAuthorized) {
      // throw Response.forbidden(AuthErrorMessage.forbidden());
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
