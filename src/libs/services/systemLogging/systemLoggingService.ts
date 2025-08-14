import { prisma } from '@libs/infrastructure/services/core/database/prismaService';
import { SystemLogCategory, SystemLogLevel, UserRoleEnum } from '@prisma/client';

export interface SystemLogData {
  level: SystemLogLevel;
  category: SystemLogCategory;
  eventType: string;
  message: string;

  // User context (optional)
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: UserRoleEnum;

  // Request context
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  sessionId?: string;

  // Resource context
  resourceType?: string;
  resourceId?: string;

  // Performance tracking
  duration?: number;
  statusCode?: number;

  // Data context (will be sanitized)
  oldValues?: any;
  newValues?: any;
  metadata?: any;

  // Error context
  errorCode?: string;
  errorMessage?: string;
  stackTrace?: string;
}

export interface SystemLogFilters {
  level?: SystemLogLevel[];
  category?: SystemLogCategory[];
  eventType?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  resourceType?: string;
  resourceId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SystemLogStats {
  totalLogs: number;
  byLevel: Record<SystemLogLevel, number>;
  byCategory: Record<SystemLogCategory, number>;
  recentErrors: number;
  criticalAlerts: number;
  averageResponseTime: number;
}

/**
 * Comprehensive system logging service for monitoring all system activities
 */
export class SystemLoggingService {
  /**
   * Create a system log entry
   */
  static async createLog(data: SystemLogData): Promise<void> {
    try {
      // Sanitize sensitive data
      const sanitizedOldValues = this.sanitizeData(data.oldValues);
      const sanitizedNewValues = this.sanitizeData(data.newValues);
      const sanitizedMetadata = this.sanitizeData(data.metadata);

      await prisma.systemLog.create({
        data: {
          category: data.category,
          duration: data.duration,
          errorCode: data.errorCode,
          errorMessage: data.errorMessage?.substring(0, 2000),
          eventType: data.eventType,

          ipAddress: data.ipAddress,

          level: data.level,

          message: data.message,

          metadata: sanitizedMetadata,

          newValues: sanitizedNewValues,

          oldValues: sanitizedOldValues,
          // Limit length
          requestId: data.requestId,
          resourceId: data.resourceId,
          resourceType: data.resourceType,
          sessionId: data.sessionId,
          // Limit length
          stackTrace: data.stackTrace?.substring(0, 5000),

          statusCode: data.statusCode,

          userAgent: data.userAgent?.substring(0, 1000),

          userEmail: data.userEmail,

          userId: data.userId,

          userName: data.userName,
          userRole: data.userRole, // Limit length
        },
      });
    } catch (error) {
      // Fallback logging to prevent infinite loops
      console.error('Failed to create system log:', error);
    }
  }

  /**
   * Authentication event logging
   */
  static async logAuthentication(
    eventType: string,
    data: {
      userId?: string;
      userEmail?: string;
      userName?: string;
      userRole?: UserRoleEnum;
      ipAddress?: string;
      userAgent?: string;
      success: boolean;
      errorMessage?: string;
      metadata?: any;
    }
  ): Promise<void> {
    await this.createLog({
      category: SystemLogCategory.AUTHENTICATION,
      errorMessage: data.errorMessage,
      eventType,
      ipAddress: data.ipAddress,
      level: data.success ? SystemLogLevel.INFO : SystemLogLevel.WARN,
      message: `Authentication event: ${eventType} for user ${data.userEmail || 'unknown'}`,
      metadata: data.metadata,
      statusCode: data.success ? 200 : 401,
      userAgent: data.userAgent,
      userEmail: data.userEmail,
      userId: data.userId,
      userName: data.userName,
      userRole: data.userRole,
    });
  }

  /**
   * Admin action logging
   */
  static async logAdminAction(
    eventType: string,
    data: {
      adminUserId: string;
      adminUserName: string;
      adminUserEmail: string;
      adminUserRole: UserRoleEnum;
      resourceType: string;
      resourceId: string;
      oldValues?: any;
      newValues?: any;
      ipAddress?: string;
      userAgent?: string;
      metadata?: any;
    }
  ): Promise<void> {
    await this.createLog({
      category: SystemLogCategory.ADMIN_ACTION,
      eventType,
      ipAddress: data.ipAddress,
      level: SystemLogLevel.INFO,
      message: `Admin action: ${eventType} on ${data.resourceType} ${data.resourceId} by ${data.adminUserEmail}`,
      metadata: data.metadata,
      newValues: data.newValues,
      oldValues: data.oldValues,
      resourceId: data.resourceId,
      resourceType: data.resourceType,
      userAgent: data.userAgent,
      userEmail: data.adminUserEmail,
      userId: data.adminUserId,
      userName: data.adminUserName,
      userRole: data.adminUserRole,
    });
  }

  /**
   * Payment event logging
   */
  static async logPaymentEvent(
    eventType: string,
    data: {
      userId?: string;
      paymentId: string;
      amount?: number;
      currency?: string;
      status?: string;
      success: boolean;
      errorMessage?: string;
      duration?: number;
      metadata?: any;
    }
  ): Promise<void> {
    await this.createLog({
      category: SystemLogCategory.PAYMENT_PROCESSING,
      duration: data.duration,
      errorMessage: data.errorMessage,
      eventType,
      level: data.success ? SystemLogLevel.INFO : SystemLogLevel.ERROR,
      message: `Payment event: ${eventType} for payment ${data.paymentId}`,
      metadata: {
        ...data.metadata,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
      },
      resourceId: data.paymentId,
      resourceType: 'payment',
      statusCode: data.success ? 200 : 400,
      userId: data.userId,
    });
  }

  /**
   * API request logging
   */
  static async logApiRequest(data: {
    method: string;
    url: string;
    userId?: string;
    statusCode: number;
    duration: number;
    ipAddress?: string;
    userAgent?: string;
    errorMessage?: string;
    requestId?: string;
  }): Promise<void> {
    const level =
      data.statusCode >= 500
        ? SystemLogLevel.ERROR
        : data.statusCode >= 400
          ? SystemLogLevel.WARN
          : SystemLogLevel.INFO;

    await this.createLog({
      category: SystemLogCategory.API_REQUEST,
      duration: data.duration,
      errorMessage: data.errorMessage,
      eventType: 'api_request',
      ipAddress: data.ipAddress,
      level,
      message: `${data.method} ${data.url} - ${data.statusCode}`,
      requestId: data.requestId,
      statusCode: data.statusCode,
      userAgent: data.userAgent,
      userId: data.userId,
    });
  }

  /**
   * Email event logging
   */
  static async logEmailEvent(
    eventType: string,
    data: {
      recipientEmail: string;
      subject: string;
      templateType: string;
      success: boolean;
      errorMessage?: string;
      duration?: number;
      metadata?: any;
    }
  ): Promise<void> {
    await this.createLog({
      category: SystemLogCategory.EMAIL_SERVICE,
      duration: data.duration,
      errorMessage: data.errorMessage,
      eventType,
      level: data.success ? SystemLogLevel.INFO : SystemLogLevel.ERROR,
      message: `Email event: ${eventType} to ${data.recipientEmail}`,
      metadata: {
        recipientEmail: data.recipientEmail,
        subject: data.subject,
        templateType: data.templateType,
        ...data.metadata,
      },
      statusCode: data.success ? 200 : 500,
    });
  }

  /**
   * Security event logging
   */
  static async logSecurityEvent(
    eventType: string,
    data: {
      userId?: string;
      userEmail?: string;
      ipAddress?: string;
      userAgent?: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      metadata?: any;
    }
  ): Promise<void> {
    const level =
      data.severity === 'critical'
        ? SystemLogLevel.CRITICAL
        : data.severity === 'high'
          ? SystemLogLevel.ERROR
          : data.severity === 'medium'
            ? SystemLogLevel.WARN
            : SystemLogLevel.INFO;

    await this.createLog({
      category: SystemLogCategory.SECURITY_EVENT,
      eventType,
      ipAddress: data.ipAddress,
      level,
      message: `Security event: ${data.description}`,
      metadata: data.metadata,
      userAgent: data.userAgent,
      userEmail: data.userEmail,
      userId: data.userId,
    });
  }

  /**
   * Database operation logging
   */
  static async logDatabaseOperation(
    eventType: string,
    data: {
      operation: 'create' | 'update' | 'delete';
      tableName: string;
      recordId: string;
      userId?: string;
      oldValues?: any;
      newValues?: any;
      duration?: number;
    }
  ): Promise<void> {
    await this.createLog({
      category: SystemLogCategory.DATABASE_OPERATION,
      duration: data.duration,
      eventType,
      level: SystemLogLevel.INFO,
      message: `Database ${data.operation} on ${data.tableName} record ${data.recordId}`,
      newValues: data.newValues,
      oldValues: data.oldValues,
      resourceId: data.recordId,
      resourceType: data.tableName,
      userId: data.userId,
    });
  }

  /**
   * Performance monitoring logging
   */
  static async logPerformanceMetric(
    eventType: string,
    data: {
      metricName: string;
      value: number;
      threshold?: number;
      unit: string;
      metadata?: any;
    }
  ): Promise<void> {
    const level =
      data.threshold && data.value > data.threshold ? SystemLogLevel.WARN : SystemLogLevel.INFO;

    await this.createLog({
      category: SystemLogCategory.PERFORMANCE,
      duration: data.unit === 'ms' ? data.value : undefined,
      eventType,
      level,
      message: `Performance metric: ${data.metricName} = ${data.value}${data.unit}`,
      metadata: data.metadata,
    });
  }

  /**
   * Get system logs with filtering and pagination
   */
  static async getLogs(filters: SystemLogFilters = {}) {
    const {
      category,
      dateFrom,
      dateTo,
      eventType,
      level,
      limit = 50,
      page = 1,
      resourceId,
      resourceType,
      search,
      userId,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (level && level.length > 0) {
      where.level = { in: level };
    }

    if (category && category.length > 0) {
      where.category = { in: category };
    }

    if (eventType) {
      where.eventType = { contains: eventType, mode: 'insensitive' };
    }

    if (userId) {
      where.userId = userId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    if (resourceType) {
      where.resourceType = { contains: resourceType, mode: 'insensitive' };
    }

    if (resourceId) {
      where.resourceId = resourceId;
    }

    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { userEmail: { contains: search, mode: 'insensitive' } },
        { eventType: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.systemLog.findMany({
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              id: true,
              lastName: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        where,
      }),
      prisma.systemLog.count({ where }),
    ]);

    return {
      hasMore: skip + logs.length < total,
      logs,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get system log statistics
   */
  static async getLogStats(
    timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): Promise<SystemLogStats> {
    const now = new Date();
    const timeAgo = new Date();

    switch (timeframe) {
      case 'hour':
        timeAgo.setHours(now.getHours() - 1);
        break;
      case 'day':
        timeAgo.setDate(now.getDate() - 1);
        break;
      case 'week':
        timeAgo.setDate(now.getDate() - 7);
        break;
      case 'month':
        timeAgo.setMonth(now.getMonth() - 1);
        break;
    }

    const [totalLogs, levelStats, categoryStats, recentErrors, criticalAlerts, avgResponseTime] =
      await Promise.all([
        prisma.systemLog.count({
          where: { createdAt: { gte: timeAgo } },
        }),
        prisma.systemLog.groupBy({
          _count: { level: true },
          by: ['level'],
          where: { createdAt: { gte: timeAgo } },
        }),
        prisma.systemLog.groupBy({
          _count: { category: true },
          by: ['category'],
          where: { createdAt: { gte: timeAgo } },
        }),
        prisma.systemLog.count({
          where: {
            createdAt: { gte: timeAgo },
            level: { in: [SystemLogLevel.ERROR, SystemLogLevel.CRITICAL] },
          },
        }),
        prisma.systemLog.count({
          where: {
            createdAt: { gte: timeAgo },
            level: SystemLogLevel.CRITICAL,
          },
        }),
        prisma.systemLog.aggregate({
          _avg: { duration: true },
          where: {
            createdAt: { gte: timeAgo },
            duration: { not: null },
          },
        }),
      ]);

    // Initialize stats objects
    const byLevel = {} as Record<SystemLogLevel, number>;
    Object.values(SystemLogLevel).forEach((level) => {
      byLevel[level] = 0;
    });

    const byCategory = {} as Record<SystemLogCategory, number>;
    Object.values(SystemLogCategory).forEach((category) => {
      byCategory[category] = 0;
    });

    // Populate actual values
    levelStats.forEach((stat) => {
      byLevel[stat.level] = stat._count.level;
    });

    categoryStats.forEach((stat) => {
      byCategory[stat.category] = stat._count.category;
    });

    return {
      averageResponseTime: avgResponseTime._avg.duration || 0,
      byCategory,
      byLevel,
      criticalAlerts,
      recentErrors,
      totalLogs,
    };
  }

  /**
   * Clean up old logs based on retention policy
   */
  static async cleanupOldLogs(retentionDays: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.systemLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        level: { not: SystemLogLevel.CRITICAL }, // Keep critical logs longer
      },
    });

    return result.count;
  }

  /**
   * Export logs to CSV format
   */
  static async exportLogs(filters: SystemLogFilters = {}): Promise<string> {
    const { logs } = await this.getLogs({ ...filters, limit: 10000 });

    const csvHeaders = [
      'Timestamp',
      'Level',
      'Category',
      'Event Type',
      'Message',
      'User Email',
      'User Role',
      'Resource Type',
      'Resource ID',
      'IP Address',
      'Status Code',
      'Duration',
      'Error Message',
    ];

    const csvRows = logs.map((log) => [
      log.createdAt.toISOString(),
      log.level,
      log.category,
      log.eventType,
      log.message.replace(/"/g, '""'), // Escape quotes
      log.userEmail || '',
      log.userRole || '',
      log.resourceType || '',
      log.resourceId || '',
      log.ipAddress || '',
      log.statusCode || '',
      log.duration || '',
      (log.errorMessage || '').replace(/"/g, '""'),
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.map((field) => `"${field}"`).join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Sanitize data to remove sensitive information
   */
  private static sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'apiKey',
      'authorization',
      'credit',
      'card',
      'cvv',
      'ssn',
      'social',
    ];

    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;

      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }

      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive));

        if (isSensitive) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };

    return sanitizeObject(data);
  }
}
