import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedRequest } from '../common/types/authenticated-request';
import { ROLES_METADATA_KEY } from '../decorators/roles.decorator';
import type { UserRole } from '../constants/roles';

/**
 * RolesGuard enforces role-based authorization.
 *
 * It reads the required roles from the @Roles decorator metadata
 * and the authenticated user from the request (set by JwtAuthGuard).
 *
 * Behavior:
 * - No roles required → allow
 * - User role not in required roles → 403 Forbidden
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_METADATA_KEY,
      context.getHandler()
    );

    // No role restriction on this route
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      // Should not happen if JwtAuthGuard runs first, but guard anyway
      throw new ForbiddenException('Access denied');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}