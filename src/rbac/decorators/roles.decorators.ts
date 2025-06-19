import { SetMetadata } from '@nestjs/common';
import { AdminRoles } from '../enums/admin-roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AdminRoles[]) => SetMetadata(ROLES_KEY, roles);
