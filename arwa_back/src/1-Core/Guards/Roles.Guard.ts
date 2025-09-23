import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/2-Domain';
import { JWTToken } from 'src/3-Infrastructure/Authentication/AuthModels/token.model';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // No roles are specified for the endpoint, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JWTToken;
    // Check if the user's role has the required permissions
    if (roles.findIndex((r) => user.roles.includes(UserRole[r])) != -1) {
      return true;
    }
    return false;
  }
}
