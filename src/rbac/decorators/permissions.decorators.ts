import { SetMetadata } from '@nestjs/common';
import { permissions } from '../enums/permissions';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
