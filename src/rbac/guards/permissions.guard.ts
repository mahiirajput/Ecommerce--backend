import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorators';
import { permissions} from '../enums/permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
canActivate(context: ExecutionContext): boolean {
  const requiredPermissions = this.reflector.getAllAndOverride<permissions[]>(PERMISSIONS_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  if (!requiredPermissions?.length) return true;

  const request = context.switchToHttp().getRequest();
  

  const permissions = request.user?.permissions || [request.headers['x-permission']].filter(Boolean);
  if (!permissions?.length) {
    throw new ForbiddenException('User permissions not found');
  }

  const hasAllPermissions = requiredPermissions.every(perm => permissions.includes(perm));
  if (hasAllPermissions) return true;
  
  throw new ForbiddenException(`User lacks required permissions: ${requiredPermissions.join(', ')}`);
}
}

