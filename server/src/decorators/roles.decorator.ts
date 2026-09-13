import type { UserRole } from '../constants/roles';
/**
 * Metadata key used by RolesGuard to read required roles.
 */
export const ROLES_METADATA_KEY = 'ROLES';

/**
 * @Roles decorator marks an endpoint as requiring specific user roles.
 *
 * Usage:
 *   @Roles(UserRole.MUNICIPALITY)
 *   @Roles(UserRole.MUNICIPALITY, UserRole.COLLECTOR)
 *
 * The decorator is read by RolesGuard. The user's role comes from the
 * verified JWT payload, never from request body or query parameters.
 */
export function Roles(...roles: UserRole[]): MethodDecorator {
  return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ROLES_METADATA_KEY, roles, descriptor.value);
    return descriptor;
  };
}