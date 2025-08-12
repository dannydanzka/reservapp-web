import type { ACTIONS, MODULES, Permission, PermissionFilters } from '@shared/types/admin.types';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';

export class PermissionRepository {
  async findById(id: string): Promise<Permission | null> {
    try {
      const permission = await prisma.permission.findUnique({
        where: { id },
      });

      return permission ? this.mapToPermission(permission) : null;
    } catch (error) {
      throw new Error(
        `Error finding permission: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByName(name: string): Promise<Permission | null> {
    try {
      const permission = await prisma.permission.findUnique({
        where: { name },
      });

      return permission ? this.mapToPermission(permission) : null;
    } catch (error) {
      throw new Error(
        `Error finding permission by name: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findMany(filters: PermissionFilters = {}): Promise<Permission[]> {
    try {
      const where: any = {};

      if (filters.module) {
        where.module = filters.module;
      }

      if (filters.action) {
        where.action = filters.action;
      }

      if (filters.resource) {
        where.resource = filters.resource;
      }

      if (filters.isSystemPerm !== undefined) {
        where.isSystemPerm = filters.isSystemPerm;
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search } },
          { description: { contains: filters.search } },
          { module: { contains: filters.search } },
          { action: { contains: filters.search } },
        ];
      }

      const permissions = await prisma.permission.findMany({
        orderBy: [{ module: 'asc' }, { action: 'asc' }, { name: 'asc' }],
        where,
      });

      return permissions.map(this.mapToPermission);
    } catch (error) {
      throw new Error(
        `Error fetching permissions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByModule(module: string): Promise<Permission[]> {
    return this.findMany({ module });
  }

  async findByModuleAndAction(module: string, action: string): Promise<Permission[]> {
    return this.findMany({ action, module });
  }

  async getModules(): Promise<string[]> {
    try {
      const result = await prisma.permission.findMany({
        distinct: ['module'],
        orderBy: { module: 'asc' },
        select: { module: true },
      });

      return result.map((r) => r.module);
    } catch (error) {
      throw new Error(
        `Error fetching modules: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getActions(): Promise<string[]> {
    try {
      const result = await prisma.permission.findMany({
        distinct: ['action'],
        orderBy: { action: 'asc' },
        select: { action: true },
      });

      return result.map((r) => r.action);
    } catch (error) {
      throw new Error(
        `Error fetching actions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getPermissionsByIds(ids: string[]): Promise<Permission[]> {
    try {
      const permissions = await prisma.permission.findMany({
        orderBy: [{ module: 'asc' }, { action: 'asc' }, { name: 'asc' }],
        where: {
          id: { in: ids },
        },
      });

      return permissions.map(this.mapToPermission);
    } catch (error) {
      throw new Error(
        `Error fetching permissions by IDs: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async checkPermissionExists(module: string, action: string, resource?: string): Promise<boolean> {
    try {
      const permission = await prisma.permission.findFirst({
        where: {
          action,
          module,
          resource: resource || null,
        },
      });

      return Boolean(permission);
    } catch (error) {
      return false;
    }
  }

  async createCustomPermission(
    name: string,
    description: string,
    module: string,
    action: string,
    resource?: string
  ): Promise<Permission> {
    try {
      const permission = await prisma.permission.create({
        data: {
          action,
          description,
          isSystemPerm: false,
          module,
          name,
          resource,
        },
      });

      return this.mapToPermission(permission);
    } catch (error) {
      throw new Error(
        `Error creating custom permission: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteCustomPermission(id: string): Promise<void> {
    try {
      const permission = await this.findById(id);
      if (!permission) {
        throw new Error('Permission not found');
      }

      if (permission.isSystemPerm) {
        throw new Error('Cannot delete system permission');
      }

      await prisma.permission.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        `Error deleting custom permission: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getPermissionStats(): Promise<{
    total: number;
    systemPermissions: number;
    customPermissions: number;
    moduleBreakdown: Record<string, number>;
    actionBreakdown: Record<string, number>;
  }> {
    try {
      const [total, systemPermissions, customPermissions, moduleBreakdown, actionBreakdown] =
        await Promise.all([
          prisma.permission.count(),
          prisma.permission.count({ where: { isSystemPerm: true } }),
          prisma.permission.count({ where: { isSystemPerm: false } }),
          prisma.permission.groupBy({
            _count: { module: true },
            by: ['module'],
            orderBy: { module: 'asc' },
          }),
          prisma.permission.groupBy({
            _count: { action: true },
            by: ['action'],
            orderBy: { action: 'asc' },
          }),
        ]);

      return {
        actionBreakdown: actionBreakdown.reduce(
          (acc, item) => {
            acc[item.action] = item._count.action;
            return acc;
          },
          {} as Record<string, number>
        ),
        customPermissions,
        moduleBreakdown: moduleBreakdown.reduce(
          (acc, item) => {
            acc[item.module] = item._count.module;
            return acc;
          },
          {} as Record<string, number>
        ),
        systemPermissions,
        total,
      };
    } catch (error) {
      throw new Error(
        `Error getting permission stats: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private mapToPermission(permission: any): Permission {
    return {
      action: permission.action,
      description: permission.description,
      id: permission.id,
      isSystemPerm: permission.isSystemPerm,
      module: permission.module,
      name: permission.name,
      resource: permission.resource,
    };
  }
}

export const permissionRepository = new PermissionRepository();
