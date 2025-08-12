import { AdminAuditService } from '@mod-admin/infrastructure/services/admin/AdminAuditService';

const adminAuditService = new AdminAuditService();
import type {
  AssignRoleData,
  Permission,
  UserRoleAssignment,
  UserRoleFilters,
  UserWithRoles,
} from '@shared/types/admin.types';
import { prisma } from '@infrastructure/services/core/database/prismaService';

export class UserRoleRepository {
  async assignRole(data: AssignRoleData): Promise<UserRoleAssignment> {
    try {
      const userRole = await prisma.userRoleAssignment.create({
        data: {
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
          grantedBy: data.grantedBy,
          metadata: data.metadata,
          roleId: data.roleId,
          userId: data.userId,
          venueId: data.venueId,
        },
        include: {
          grantor: {
            select: {
              firstName: true,
              id: true,
              lastName: true,
            },
          },
          role: true,
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Track role assignment in audit log
      await adminAuditService.trackAction(
        {
          adminUserId: data.grantedBy,
        },
        {
          action: 'BULK_PAYMENT_UPDATE',
          metadata: {
            action: 'ROLE_ASSIGN',
            expiresAt: data.expiresAt,
            roleId: data.roleId,
            roleName: userRole.role.name,
            venueId: data.venueId,
          },

          resourceId: data.userId,
          // Using existing action, ideally we'd have USER_ROLE_ASSIGN
          resourceType: 'USER',
        }
      );

      return this.mapToUserRoleAssignment(userRole);
    } catch (error) {
      throw new Error(
        `Error assigning role: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async revokeRole(userRoleId: string, revokedBy: string, reason?: string): Promise<void> {
    try {
      const userRole = await prisma.userRoleAssignment.findUnique({
        include: {
          role: true,
          user: {
            select: {
              firstName: true,
              id: true,
              lastName: true,
            },
          },
        },
        where: { id: userRoleId },
      });

      if (!userRole) {
        throw new Error('User role assignment not found');
      }

      await prisma.userRoleAssignment.update({
        data: { isActive: false },
        where: { id: userRoleId },
      });

      // Track role revocation in audit log
      await adminAuditService.trackAction(
        {
          adminUserId: revokedBy,
        },
        {
          action: 'BULK_PAYMENT_UPDATE',
          metadata: {
            action: 'ROLE_REVOKE',
            reason,
            roleId: userRole.roleId,
            roleName: userRole.role.name,
            venueId: userRole.venueId,
          },

          resourceId: userRole.userId,
          // Using existing action, ideally we'd have USER_ROLE_REVOKE
          resourceType: 'USER',
        }
      );
    } catch (error) {
      throw new Error(
        `Error revoking role: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async updateRoleAssignment(
    userRoleId: string,
    updates: {
      expiresAt?: string;
      isActive?: boolean;
      metadata?: Record<string, any>;
    },
    updatedBy: string
  ): Promise<UserRoleAssignment> {
    try {
      const userRole = await prisma.userRoleAssignment.update({
        data: {
          expiresAt: updates.expiresAt ? new Date(updates.expiresAt) : undefined,
          isActive: updates.isActive,
          metadata: updates.metadata,
        },
        include: {
          grantor: {
            select: {
              firstName: true,
              id: true,
              lastName: true,
            },
          },
          role: true,
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: { id: userRoleId },
      });

      // Track role update in audit log
      await adminAuditService.trackAction(
        {
          adminUserId: updatedBy,
        },
        {
          action: 'BULK_PAYMENT_UPDATE',
          metadata: {
            action: 'ROLE_UPDATE',
            roleId: userRole.roleId,
            roleName: userRole.role.name,
            updates,
          },

          resourceId: userRole.userId,
          // Using existing action, ideally we'd have USER_ROLE_UPDATE
          resourceType: 'USER',
        }
      );

      return this.mapToUserRoleAssignment(userRole);
    } catch (error) {
      throw new Error(
        `Error updating role assignment: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getUserRoles(userId: string, includeInactive = false): Promise<UserRoleAssignment[]> {
    try {
      const where: any = { userId };

      if (!includeInactive) {
        where.isActive = true;
        where.OR = [{ expiresAt: null }, { expiresAt: { gt: new Date() } }];
      }

      const userRoles = await prisma.userRoleAssignment.findMany({
        include: {
          grantor: {
            select: {
              firstName: true,
              id: true,
              lastName: true,
            },
          },
          role: true,
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { grantedAt: 'desc' },
        where,
      });

      return userRoles.map(this.mapToUserRoleAssignment);
    } catch (error) {
      throw new Error(
        `Error getting user roles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getUserWithRoles(userId: string): Promise<UserWithRoles | null> {
    try {
      const user = await prisma.user.findUnique({
        include: {
          userRoles: {
            include: {
              grantor: {
                select: {
                  firstName: true,
                  id: true,
                  lastName: true,
                },
              },
              role: true,
              venue: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            where: {
              OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
              isActive: true,
            },
          },
        },
        where: { id: userId },
      });

      return user ? this.mapToUserWithRoles(user) : null;
    } catch (error) {
      throw new Error(
        `Error getting user with roles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getUserPermissions(userId: string, venueId?: string): Promise<Permission[]> {
    try {
      const where: any = {
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        isActive: true,
        userId,
      };

      if (venueId) {
        where.OR = [
          { venueId },
          { venueId: null }, // Global roles
        ];
      } else {
        where.venueId = null; // Only global roles
      }

      const userRoles = await prisma.userRoleAssignment.findMany({
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
        where,
      });

      // Collect all unique permissions from all roles
      const permissionMap = new Map<string, any>();

      for (const userRole of userRoles) {
        for (const rolePermission of userRole.role.permissions) {
          permissionMap.set(rolePermission.permission.id, rolePermission.permission);
        }
      }

      return Array.from(permissionMap.values()).map((permission) => ({
        action: permission.action,
        createdAt: permission.createdAt.toISOString(),
        description: permission.description,
        id: permission.id,
        isSystemPerm: permission.isSystemPerm,
        module: permission.module,
        name: permission.name,
        resource: permission.resource,
      }));
    } catch (error) {
      throw new Error(
        `Error getting user permissions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async checkUserPermission(
    userId: string,
    module: string,
    action: string,
    venueId?: string,
    resource?: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId, venueId);

      return permissions.some(
        (permission) =>
          permission.module === module &&
          permission.action === action &&
          (resource ? permission.resource === resource : true)
      );
    } catch (error) {
      return false;
    }
  }

  async findUserRoles(filters: UserRoleFilters = {}): Promise<UserRoleAssignment[]> {
    try {
      const where: any = {};

      if (filters.userId) {
        where.userId = filters.userId;
      }

      if (filters.roleId) {
        where.roleId = filters.roleId;
      }

      if (filters.venueId) {
        where.venueId = filters.venueId;
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.expiresAt) {
        where.expiresAt = { lte: new Date(filters.expiresAt) };
      }

      const userRoles = await prisma.userRoleAssignment.findMany({
        include: {
          grantor: {
            select: {
              firstName: true,
              id: true,
              lastName: true,
            },
          },
          role: true,
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { grantedAt: 'desc' },
        where,
      });

      return userRoles.map(this.mapToUserRoleAssignment);
    } catch (error) {
      throw new Error(
        `Error finding user roles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getExpiredRoles(): Promise<UserRoleAssignment[]> {
    try {
      const expiredRoles = await prisma.userRoleAssignment.findMany({
        include: {
          grantor: {
            select: {
              firstName: true,
              id: true,
              lastName: true,
            },
          },
          role: true,
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          expiresAt: { lte: new Date() },
          isActive: true,
        },
      });

      return expiredRoles.map(this.mapToUserRoleAssignment);
    } catch (error) {
      throw new Error(
        `Error getting expired roles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deactivateExpiredRoles(): Promise<number> {
    try {
      const result = await prisma.userRoleAssignment.updateMany({
        data: { isActive: false },
        where: {
          expiresAt: { lte: new Date() },
          isActive: true,
        },
      });

      return result.count;
    } catch (error) {
      throw new Error(
        `Error deactivating expired roles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private mapToUserRoleAssignment(userRole: any): UserRoleAssignment {
    return {
      expiresAt: userRole.expiresAt?.toISOString(),
      grantedAt: userRole.grantedAt.toISOString(),
      grantedBy: userRole.grantedBy,
      grantor: userRole.grantor
        ? {
            firstName: userRole.grantor.firstName,
            id: userRole.grantor.id,
            lastName: userRole.grantor.lastName,
          }
        : undefined,
      id: userRole.id,
      isActive: userRole.isActive,
      metadata: userRole.metadata,
      role: {
        createdAt: userRole.role.createdAt.toISOString(),
        description: userRole.role.description,
        id: userRole.role.id,
        isActive: userRole.role.isActive,
        isSystemRole: userRole.role.isSystemRole,
        name: userRole.role.name,
        updatedAt: userRole.role.updatedAt.toISOString(),
      },
      roleId: userRole.roleId,
      userId: userRole.userId,
      venue: userRole.venue
        ? {
            id: userRole.venue.id,
            name: userRole.venue.name,
          }
        : undefined,
      venueId: userRole.venueId,
    };
  }

  private mapToUserWithRoles(user: any): UserWithRoles {
    return {
      createdAt: user.createdAt,
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      isActive: user.isActive,
      lastName: user.lastName,
      role: user.role,
      userRoles: user.userRoles.map(this.mapToUserRoleAssignment),
    };
  }
}

export const userRoleRepository = new UserRoleRepository();
