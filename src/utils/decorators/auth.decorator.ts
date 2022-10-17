import { AuthRoles } from 'src/auth/decorator/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';

import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UserRole } from '../../users/entities/user.entity';

export function Auth(role?: UserRole | UserRole[]) {
  let roles = [];
  if (typeof role === 'string') roles = [role];
  else roles = role;
  return applyDecorators(
    AuthRoles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth('accessToken'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
