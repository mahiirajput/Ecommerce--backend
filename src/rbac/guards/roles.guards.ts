import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { AdminRoles } from '../enums/admin-roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

canActivate(context: ExecutionContext): boolean {
  const requiredRoles = this.reflector.getAllAndOverride<AdminRoles[]>(ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  if (!requiredRoles?.length) return true;

  const request = context.switchToHttp().getRequest();
  
  const role = request.user?.role || request.headers['x-role'];
  if (!role) throw new ForbiddenException('User role not found');

  if (requiredRoles.includes(role)) return true;
  throw new ForbiddenException(`User role '${role}' is not authorized`);
}
}
