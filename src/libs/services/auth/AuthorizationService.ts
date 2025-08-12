import type {
  ACTIONS,
  MODULES,
  Permission,
  PermissionCheckContext,
  UserWithRoles,
} from '@shared/types/admin.types';
import { permissionRepository } from '@mod-admin/infrastructure/repositories/PermissionRepository';
import { roleRepository } from '@mod-admin/infrastructure/repositories/RoleRepository';
import { userRoleRepository } from '@libs/data/repositories/UserRoleRepository';

export interface AuthorizationContext {
  userId: string;
  userRole?: string; // Basic user role from User model
  venueId?: string;
  resource?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuthorizationService {
  async checkPermission(
    context: AuthorizationContext,
    module: string,
    action: string,
    resource?: string
  ): Promise<boolean> {
    try {
      // Super admin bypass
      if (context.userRole === 'SUPER_ADMIN') {
        return true;
      }

      // Check role-based permissions
      return await userRoleRepository.checkUserPermission(
        context.userId,
        module,
        action,
        context.venueId,
        resource
      );
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  async checkMultiplePermissions(
    context: AuthorizationContext,
    permissions: Array<{ module: string; action: string; resource?: string }>
  ): Promise<boolean> {
    try {
      for (const permission of permissions) {
        const hasPermission = await this.checkPermission(
          context,
          permission.module,
          permission.action,
          permission.resource
        );

        if (!hasPermission) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking multiple permissions:', error);
      return false;
    }
  }

  async hasAnyPermission(
    context: AuthorizationContext,
    permissions: Array<{ module: string; action: string; resource?: string }>
  ): Promise<boolean> {
    try {
      for (const permission of permissions) {
        const hasPermission = await this.checkPermission(
          context,
          permission.module,
          permission.action,
          permission.resource
        );

        if (hasPermission) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking any permission:', error);
      return false;
    }
  }

  async getUserPermissions(userId: string, venueId?: string): Promise<Permission[]> {
    try {
      return await userRoleRepository.getUserPermissions(userId, venueId);
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  async getUserWithRoles(userId: string): Promise<UserWithRoles | null> {
    try {
      return await userRoleRepository.getUserWithRoles(userId);
    } catch (error) {
      console.error('Error getting user with roles:', error);
      return null;
    }
  }

  // Quick permission checks for common operations
  async canAccessDashboard(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'dashboard', 'read');
  }

  async canManagePayments(context: AuthorizationContext): Promise<boolean> {
    return this.hasAnyPermission(context, [
      { action: 'read', module: 'payments' },
      { action: 'update', module: 'payments' },
      { action: 'refund', module: 'payments' },
    ]);
  }

  async canRefundPayments(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'payments', 'refund');
  }

  async canVerifyPayments(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'payments', 'verify');
  }

  async canBulkUpdatePayments(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'payments', 'bulk_update');
  }

  async canManageReservations(context: AuthorizationContext): Promise<boolean> {
    return this.hasAnyPermission(context, [
      { action: 'read', module: 'reservations' },
      { action: 'create', module: 'reservations' },
      { action: 'update', module: 'reservations' },
    ]);
  }

  async canCancelReservations(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'reservations', 'cancel');
  }

  async canManageUsers(context: AuthorizationContext): Promise<boolean> {
    return this.hasAnyPermission(context, [
      { action: 'read', module: 'users' },
      { action: 'create', module: 'users' },
      { action: 'update', module: 'users' },
    ]);
  }

  async canManagePermissions(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'users', 'manage_permissions');
  }

  async canAccessReports(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'reports', 'read');
  }

  async canExportReports(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'reports', 'export');
  }

  async canAccessAuditLogs(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'audit', 'read');
  }

  async canManageVenues(context: AuthorizationContext): Promise<boolean> {
    return this.hasAnyPermission(context, [
      { action: 'read', module: 'venues' },
      { action: 'update', module: 'venues' },
    ]);
  }

  async canManageServices(context: AuthorizationContext): Promise<boolean> {
    return this.hasAnyPermission(context, [
      { action: 'read', module: 'services' },
      { action: 'create', module: 'services' },
      { action: 'update', module: 'services' },
    ]);
  }

  async canVerifyReceipts(context: AuthorizationContext): Promise<boolean> {
    return this.checkPermission(context, 'receipts', 'verify');
  }

  // Venue-specific permission checks
  async canAccessVenue(context: AuthorizationContext, venueId: string): Promise<boolean> {
    try {
      const contextWithVenue = { ...context, venueId };

      // Check if user has any permission for this specific venue
      return this.hasAnyPermission(contextWithVenue, [
        { action: 'read', module: 'venues' },
        { action: 'update', module: 'venues' },
        { action: 'read', module: 'payments' },
        { action: 'read', module: 'reservations' },
      ]);
    } catch (error) {
      console.error('Error checking venue access:', error);
      return false;
    }
  }

  // Role management permissions
  async canAssignRole(
    context: AuthorizationContext,
    roleId: string,
    targetUserId: string
  ): Promise<boolean> {
    try {
      // Must have permission to manage permissions
      if (!(await this.canManagePermissions(context))) {
        return false;
      }

      // Get the role being assigned
      const role = await roleRepository.findById(roleId);
      if (!role) {
        return false;
      }

      // Super admins can assign any role
      if (context.userRole === 'SUPER_ADMIN') {
        return true;
      }

      // Admins can assign roles except SUPER_ADMIN
      if (context.userRole === 'ADMIN' && role.name !== 'super_admin') {
        return true;
      }

      // Managers can assign EMPLOYEE and VIEWER roles
      if (context.userRole === 'MANAGER' && ['employee', 'viewer'].includes(role.name)) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking role assignment permission:', error);
      return false;
    }
  }

  // Utility methods
  async filterMenuItems(
    context: AuthorizationContext,
    menuItems: Array<{
      id: string;
      name: string;
      href: string;
      requiredPermissions?: Array<{ module: string; action: string }>;
    }>
  ): Promise<Array<{ id: string; name: string; href: string }>> {
    const filteredItems = [];

    for (const item of menuItems) {
      if (!item.requiredPermissions) {
        filteredItems.push(item);
        continue;
      }

      const hasPermission = await this.hasAnyPermission(context, item.requiredPermissions);
      if (hasPermission) {
        filteredItems.push({
          href: item.href,
          id: item.id,
          name: item.name,
        });
      }
    }

    return filteredItems;
  }

  async getAccessibleVenues(context: AuthorizationContext): Promise<string[]> {
    try {
      const userRoles = await userRoleRepository.getUserRoles(context.userId);
      const venueIds = new Set<string>();

      for (const userRole of userRoles) {
        if (userRole.venueId) {
          venueIds.add(userRole.venueId);
        }
      }

      return Array.from(venueIds);
    } catch (error) {
      console.error('Error getting accessible venues:', error);
      return [];
    }
  }

  // Context helpers
  static createContext(
    userId: string,
    userRole?: string,
    venueId?: string,
    request?: {
      ip?: string;
      headers?: { 'user-agent'?: string };
    }
  ): AuthorizationContext {
    return {
      ipAddress: request?.ip,
      userAgent: request?.headers?.['user-agent'],
      userId,
      userRole,
      venueId,
    };
  }

  // Middleware-friendly permission checker
  async requirePermission(
    context: AuthorizationContext,
    module: string,
    action: string,
    resource?: string
  ): Promise<void> {
    const hasPermission = await this.checkPermission(context, module, action, resource);

    if (!hasPermission) {
      throw new Error(`Access denied: missing ${module}:${action} permission`);
    }
  }

  // Batch permission check for optimization
  async batchCheckPermissions(
    context: AuthorizationContext,
    permissions: Array<{ module: string; action: string; resource?: string }>
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    try {
      const userPermissions = await this.getUserPermissions(context.userId, context.venueId);

      for (const permission of permissions) {
        const key = `${permission.module}:${permission.action}${permission.resource ? `:${permission.resource}` : ''}`;

        results[key] = userPermissions.some(
          (up) =>
            up.module === permission.module &&
            up.action === permission.action &&
            (!permission.resource || up.resource === permission.resource)
        );
      }
    } catch (error) {
      console.error('Error in batch permission check:', error);
      // Default to false for all permissions on error
      for (const permission of permissions) {
        const key = `${permission.module}:${permission.action}${permission.resource ? `:${permission.resource}` : ''}`;
        results[key] = false;
      }
    }

    return results;
  }
}

export const authorizationService = new AuthorizationService();
