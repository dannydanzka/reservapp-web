import type {
  CreateRoleData,
  Role,
  RoleFilters,
  RoleWithPermissions,
  UpdateRoleData,
} from '@shared/types/permissions';
import type { Permission } from '@shared/types/admin.types';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';
import { ROLE_PERMISSIONS, SYSTEM_PERMISSIONS, SYSTEM_ROLES } from '@shared/types/permissions';

export class RoleRepository {
  async create(data: CreateRoleData): Promise<RoleWithPermissions> {
    try {
      const role = await prisma.role.create({
        data: {
          description: data.description,
          isSystemRole: false,
          name: data.name,
        },
      });

      // Assign permissions to role
      if (data.permissionIds.length > 0) {
        await prisma.rolePermission.createMany({
          data: data.permissionIds.map((permissionId) => ({
            permissionId,
            roleId: role.id,
          })),
        });
      }

      return this.findByIdWithPermissions(role.id);
    } catch (error) {
      throw new Error(
        `Error creating role: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findById(id: string): Promise<Role | null> {
    try {
      const role = await prisma.role.findUnique({
        where: { id },
      });

      return role ? this.mapToRole(role) : null;
    } catch (error) {
      throw new Error(
        `Error finding role: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByIdWithPermissions(id: string): Promise<RoleWithPermissions | null> {
    try {
      const role = await prisma.role.findUnique({
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
        where: { id },
      });

      return role ? this.mapToRoleWithPermissions(role) : null;
    } catch (error) {
      throw new Error(
        `Error finding role with permissions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByName(name: string): Promise<Role | null> {
    try {
      const role = await prisma.role.findUnique({
        where: { name },
      });

      return role ? this.mapToRole(role) : null;
    } catch (error) {
      throw new Error(
        `Error finding role by name: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findMany(filters: RoleFilters = {}): Promise<RoleWithPermissions[]> {
    try {
      const where: any = {};

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.isSystemRole !== undefined) {
        where.isSystemRole = filters.isSystemRole;
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search } },
          { description: { contains: filters.search } },
        ];
      }

      const roles = await prisma.role.findMany({
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
        orderBy: [{ isSystemRole: 'desc' }, { name: 'asc' }],
        where,
      });

      return roles.map(this.mapToRoleWithPermissions);
    } catch (error) {
      throw new Error(
        `Error fetching roles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async update(id: string, data: UpdateRoleData): Promise<RoleWithPermissions> {
    try {
      const role = await prisma.role.update({
        data: {
          description: data.description,
          isActive: data.isActive,
          name: data.name,
        },
        where: { id },
      });

      // Update permissions if provided
      if (data.permissionIds !== undefined) {
        // Remove existing permissions
        await prisma.rolePermission.deleteMany({
          where: { roleId: id },
        });

        // Add new permissions
        if (data.permissionIds.length > 0) {
          await prisma.rolePermission.createMany({
            data: data.permissionIds.map((permissionId) => ({
              permissionId,
              roleId: id,
            })),
          });
        }
      }

      return this.findByIdWithPermissions(id);
    } catch (error) {
      throw new Error(
        `Error updating role: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const role = await this.findById(id);
      if (!role) {
        throw new Error('Role not found');
      }

      if (role.isSystemRole) {
        throw new Error('Cannot delete system role');
      }

      await prisma.role.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        `Error deleting role: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async initializeSystemRoles(): Promise<void> {
    try {
      console.log('Initializing system roles and permissions...');

      // First, ensure all system permissions exist
      await this.initializeSystemPermissions();

      // Create system roles
      for (const [roleKey, roleData] of Object.entries(SYSTEM_ROLES)) {
        const existingRole = await this.findByName(roleData.name);

        if (!existingRole) {
          console.log(`Creating system role: ${roleData.name}`);

          const role = await prisma.role.create({
            data: {
              description: roleData.description,
              isSystemRole: roleData.isSystemRole,
              name: roleData.name,
            },
          });

          // Assign permissions to role
          const permissionNames = ROLE_PERMISSIONS[roleData.name] || [];
          const permissions = await prisma.permission.findMany({
            where: {
              name: { in: permissionNames },
            },
          });

          if (permissions.length > 0) {
            await prisma.rolePermission.createMany({
              data: permissions.map((permission) => ({
                permissionId: permission.id,
                roleId: role.id,
              })),
            });
          }
        } else {
          console.log(`System role already exists: ${roleData.name}`);
        }
      }

      console.log('System roles initialization complete');
    } catch (error) {
      throw new Error(
        `Error initializing system roles: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async initializeSystemPermissions(): Promise<void> {
    try {
      for (const permissionData of SYSTEM_PERMISSIONS) {
        const existingPermission = await prisma.permission.findUnique({
          where: { name: permissionData.name },
        });

        if (!existingPermission) {
          await prisma.permission.create({
            data: permissionData,
          });
        }
      }
    } catch (error) {
      throw new Error(
        `Error initializing system permissions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    try {
      const rolePermissions = await prisma.rolePermission.findMany({
        include: {
          permission: true,
        },
        where: { roleId },
      });

      return rolePermissions.map((rp) => this.mapToPermission(rp.permission));
    } catch (error) {
      throw new Error(
        `Error getting role permissions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<void> {
    try {
      // Remove existing permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId },
      });

      // Add new permissions
      if (permissionIds.length > 0) {
        await prisma.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({
            permissionId,
            roleId,
          })),
        });
      }
    } catch (error) {
      throw new Error(
        `Error assigning permissions to role: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private mapToRole(role: any): Role {
    return {
      createdAt: role.createdAt.toISOString(),
      description: role.description,
      id: role.id,
      isActive: role.isActive,
      isSystemRole: role.isSystemRole,
      name: role.name,
      updatedAt: role.updatedAt.toISOString(),
    };
  }

  private mapToRoleWithPermissions(role: any): RoleWithPermissions {
    return {
      ...this.mapToRole(role),
      permissions: role.permissions.map((rp: any) => this.mapToPermission(rp.permission)),
    };
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

export const roleRepository = new RoleRepository();
