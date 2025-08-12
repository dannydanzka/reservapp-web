import type {
  AdminActionType,
  AdminAuditLog as PrismaAdminAuditLog,
  AdminResourceType,
} from '@prisma/client';
import type {
  AuditLogFilters,
  AuditLogStats,
  CreateAuditLogData,
  PaginatedAuditLogs,
} from '@shared/types/admin.types';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';

export class AuditLogRepository {
  async create(data: CreateAuditLogData): Promise<PrismaAdminAuditLog> {
    try {
      const auditLog = await prisma.adminAuditLog.create({
        data: {
          action: data.action,
          adminUserEmail: await this.getAdminEmail(data.adminUserId),
          adminUserId: data.adminUserId,
          adminUserName: await this.getAdminName(data.adminUserId),
          ipAddress: data.ipAddress,
          metadata: data.metadata,
          newValues: data.newValues,
          oldValues: data.oldValues,
          resourceId: data.resourceId,
          resourceType: data.resourceType,
          userAgent: data.userAgent,
        },
      });

      return auditLog;
    } catch (error) {
      throw new Error(
        `Error creating audit log: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findMany(filters: AuditLogFilters = {}): Promise<PaginatedAuditLogs> {
    try {
      const {
        action,
        adminUserId,
        dateFrom,
        dateTo,
        limit = 20,
        page = 1,
        resourceId,
        resourceType,
      } = filters;

      const where: any = {};

      if (adminUserId) {
        where.adminUserId = adminUserId;
      }

      if (action) {
        where.action = action;
      }

      if (resourceType) {
        where.resourceType = resourceType;
      }

      if (resourceId) {
        where.resourceId = resourceId;
      }

      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) {
          where.createdAt.gte = new Date(dateFrom);
        }
        if (dateTo) {
          where.createdAt.lte = new Date(dateTo);
        }
      }

      const [total, auditLogs] = await Promise.all([
        prisma.adminAuditLog.count({ where }),
        prisma.adminAuditLog.findMany({
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          where,
        }),
      ]);

      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      return {
        data: auditLogs,
        hasMore,
        limit,
        page,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(
        `Error fetching audit logs: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findById(id: string): Promise<PrismaAdminAuditLog | null> {
    try {
      const auditLog = await prisma.adminAuditLog.findUnique({
        where: { id },
      });

      return auditLog;
    } catch (error) {
      throw new Error(
        `Error fetching audit log: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getStats(filters: Omit<AuditLogFilters, 'page' | 'limit'> = {}): Promise<AuditLogStats> {
    try {
      const where: any = {};

      if (filters.adminUserId) {
        where.adminUserId = filters.adminUserId;
      }

      if (filters.action) {
        where.action = filters.action;
      }

      if (filters.resourceType) {
        where.resourceType = filters.resourceType;
      }

      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) {
          where.createdAt.gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          where.createdAt.lte = new Date(filters.dateTo);
        }
      }

      const [totalActions, actionsToday, topActionsData, topAdminsData] = await Promise.all([
        // Total actions
        prisma.adminAuditLog.count({ where }),

        // Actions today
        prisma.adminAuditLog.count({
          where: {
            ...where,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),

        // Top actions
        prisma.adminAuditLog.groupBy({
          _count: {
            action: true,
          },
          by: ['action'],
          orderBy: {
            _count: {
              action: 'desc',
            },
          },
          take: 5,
          where,
        }),

        // Top admins
        prisma.adminAuditLog.groupBy({
          _count: {
            adminUserId: true,
          },
          by: ['adminUserId', 'adminUserName'],
          orderBy: {
            _count: {
              adminUserId: 'desc',
            },
          },
          take: 5,
          where,
        }),
      ]);

      return {
        actionsToday,
        topActions: topActionsData.map((item) => ({
          action: item.action,
          count: item._count.action,
        })),
        topAdmins: topAdminsData.map((item) => ({
          adminUserId: item.adminUserId,
          adminUserName: item.adminUserName,
          count: item._count.adminUserId,
        })),
        totalActions,
      };
    } catch (error) {
      throw new Error(
        `Error fetching audit log stats: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByResource(
    resourceType: AdminResourceType,
    resourceId: string
  ): Promise<PrismaAdminAuditLog[]> {
    try {
      const auditLogs = await prisma.adminAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        where: {
          resourceId,
          resourceType,
        },
      });

      return auditLogs;
    } catch (error) {
      throw new Error(
        `Error fetching resource audit logs: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await prisma.adminAuditLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      return result.count;
    } catch (error) {
      throw new Error(
        `Error deleting old audit logs: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async getAdminName(adminUserId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        select: { firstName: true, lastName: true },
        where: { id: adminUserId },
      });

      return user ? `${user.firstName} ${user.lastName}` : 'Unknown Admin';
    } catch {
      return 'Unknown Admin';
    }
  }

  private async getAdminEmail(adminUserId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        select: { email: true },
        where: { id: adminUserId },
      });

      return user?.email || 'unknown@admin.com';
    } catch {
      return 'unknown@admin.com';
    }
  }
}

export const auditLogRepository = new AuditLogRepository();
