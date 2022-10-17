import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../../users/entities/user.entity';

export const AuthRoles = (...roles: UserRole[]) => {
  return SetMetadata('roles', roles);
};
