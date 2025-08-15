import { NextRequest } from 'next/server';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { User, UserRoleEnum } from '@prisma/client';

/**
 * Authorization context for permission checks
 */
export interface AuthorizationContext {
  userId: string;
  userRole: UserRoleEnum;
  venueId?: string;
}

/**
 * Permission check interface
 */
export interface PermissionCheck {
  module: string;
  action: string;
  resource?: string;
}

/**
 * Authorization service for role-based access control
 */
class AuthorizationService {
  /**
   * Role hierarchy - higher index means more permissions
   */
  private readonly roleHierarchy: UserRoleEnum[] = [
    UserRoleEnum.USER,
    UserRoleEnum.EMPLOYEE,
    UserRoleEnum.MANAGER,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ];

  /**
   * Get role hierarchy level
   */
  private getRoleLevel(role: UserRoleEnum): number {
    return this.roleHierarchy.indexOf(role);
  }

  /**
   * Check if user has specific role or higher
   */
  hasRole(userRole: UserRoleEnum, requiredRole: UserRoleEnum): boolean {
    const userLevel = this.getRoleLevel(userRole);
    const requiredLevel = this.getRoleLevel(requiredRole);
    return userLevel >= requiredLevel;
  }

  /**
   * Get user permissions based on role (simplified implementation)
   */
  async getUserPermissions(context: AuthorizationContext): Promise<string[]> {
    const { userRole } = context;

    // Base permissions by role
    const rolePermissions: Record<UserRoleEnum, string[]> = {
      [UserRoleEnum.USER]: [
        'reservations:create',
        'reservations:read_own',
        'profile:read',
        'profile:update',
      ],
      [UserRoleEnum.EMPLOYEE]: [
        'reservations:read',
        'venues:read_assigned',
        'services:read_assigned',
      ],
      [UserRoleEnum.MANAGER]: [
        'reservations:read',
        'reservations:update',
        'venues:read_own',
        'venues:update_own',
        'services:read_own',
        'services:update_own',
      ],
      [UserRoleEnum.ADMIN]: [
        'reservations:manage',
        'venues:manage_own',
        'services:manage_own',
        'users:read_own',
        'payments:read_own',
        'dashboard:read',
      ],
      [UserRoleEnum.SUPER_ADMIN]: [
        'system:manage',
        'users:manage',
        'venues:manage',
        'services:manage',
        'payments:manage',
        'reservations:manage',
        'logs:read',
        'dashboard:full_access',
      ],
    };

    // Get permissions for user role and all lower roles
    const permissions: string[] = [];
    const userLevel = this.getRoleLevel(userRole);

    for (let i = 0; i <= userLevel; i++) {
      const role = this.roleHierarchy[i];
      permissions.push(...(rolePermissions[role] || []));
    }

    return Array.from(new Set(permissions));
  }

  /**
   * Check single permission
   */
  async checkPermission(
    context: AuthorizationContext,
    module: string,
    action: string,
    resource?: string
  ): Promise<boolean> {
    const { userRole } = context;

    // Super admin has all permissions
    if (userRole === UserRoleEnum.SUPER_ADMIN) {
      return true;
    }

    // Get user permissions
    const permissions = await this.getUserPermissions(context);
    const permissionKey = `${module}:${action}`;

    return permissions.includes(permissionKey);
  }

  /**
   * Check multiple permissions (all must pass)
   */
  async checkMultiplePermissions(
    context: AuthorizationContext,
    checks: PermissionCheck[]
  ): Promise<boolean> {
    for (const check of checks) {
      const hasPermission = await this.checkPermission(
        context,
        check.module,
        check.action,
        check.resource
      );
      if (!hasPermission) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(
    context: AuthorizationContext,
    checks: PermissionCheck[]
  ): Promise<boolean> {
    for (const check of checks) {
      const hasPermission = await this.checkPermission(
        context,
        check.module,
        check.action,
        check.resource
      );
      if (hasPermission) {
        return true;
      }
    }
    return false;
  }
}

// Export singleton instance
export const authorizationService = new AuthorizationService();

/**
 * Authenticate admin users (SUPER_ADMIN role only)
 */
export async function authenticateAdmin(
  request: NextRequest,
  requiredRoles: string[] = ['SUPER_ADMIN']
): Promise<{ user: User }> {
  try {
    // First verify the token and get the user
    const user = await AuthMiddleware.verifyToken(request);

    // Check if user has the required role
    if (!requiredRoles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }

    return { user };
  } catch (error) {
    throw new Error('Authentication failed');
  }
}
