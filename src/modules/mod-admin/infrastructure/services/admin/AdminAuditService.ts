import type {
  AdminActionType,
  AdminAuditLog,
  AdminResourceType,
  AuditLogFilters,
  AuditLogStats,
  CreateAuditLogData,
  PaginatedAuditLogs,
} from '@shared/types/admin.types';
import { auditLogRepository } from '@mod-admin/infrastructure/repositories/AuditLogRepository';

interface AuditContext {
  adminUserId: string;
  ipAddress?: string;
  userAgent?: string;
}

interface TrackPaymentChangeData {
  paymentId: string;
  action: AdminActionType;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
}

interface TrackReservationChangeData {
  reservationId: string;
  action: AdminActionType;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
}

export class AdminAuditService {
  async trackAction(
    context: AuditContext,
    data: {
      action: AdminActionType;
      resourceType: AdminResourceType;
      resourceId: string;
      oldValues?: Record<string, any>;
      newValues?: Record<string, any>;
      metadata?: Record<string, any>;
    }
  ): Promise<AdminAuditLog> {
    const auditData: CreateAuditLogData = {
      action: data.action as any,
      adminUserId: context.adminUserId,
      description: `${data.action} operation on ${data.resourceType}`,
      ipAddress: context.ipAddress,
      metadata: {
        ...data.metadata,
        timestamp: new Date().toISOString(),
      },
      newValues: data.newValues,
      oldValues: data.oldValues,
      resourceId: data.resourceId,
      resourceType: data.resourceType as any,
      userAgent: context.userAgent,
    };

    return auditLogRepository.create(auditData) as any;
  }

  async trackPaymentRefund(
    context: AuditContext,
    data: TrackPaymentChangeData & {
      refundAmount: number;
      refundReason: string;
      stripeRefundId?: string;
    }
  ): Promise<AdminAuditLog> {
    return this.trackAction(context, {
      action: 'PAYMENT_REFUND' as any,
      metadata: {
        ...data.metadata,
        refundAmount: data.refundAmount,
        refundReason: data.refundReason,
        stripeRefundId: data.stripeRefundId,
      },
      newValues: data.newValues,
      oldValues: data.oldValues,
      resourceId: data.paymentId,
      resourceType: 'PAYMENT' as any,
    });
  }

  async trackPaymentStatusUpdate(
    context: AuditContext,
    data: TrackPaymentChangeData & {
      previousStatus: string;
      newStatus: string;
      reason?: string;
    }
  ): Promise<AdminAuditLog> {
    return this.trackAction(context, {
      action: 'PAYMENT_STATUS_UPDATE' as any,
      metadata: {
        ...data.metadata,
        reason: data.reason,
        statusChange: `${data.previousStatus} → ${data.newStatus}`,
      },
      newValues: {
        ...data.newValues,
        status: data.newStatus,
      },
      oldValues: {
        ...data.oldValues,
        status: data.previousStatus,
      },
      resourceId: data.paymentId,
      resourceType: 'PAYMENT' as any,
    });
  }

  async trackPaymentManualVerification(
    context: AuditContext,
    data: TrackPaymentChangeData & {
      verificationMethod: string;
      verificationNotes: string;
      evidence?: string[];
    }
  ): Promise<AdminAuditLog> {
    return this.trackAction(context, {
      action: 'PAYMENT_MANUAL_VERIFICATION' as any,
      metadata: {
        ...data.metadata,
        evidence: data.evidence,
        verificationMethod: data.verificationMethod,
        verificationNotes: data.verificationNotes,
      },
      newValues: data.newValues,
      oldValues: data.oldValues,
      resourceId: data.paymentId,
      resourceType: 'PAYMENT' as any,
    });
  }

  async trackReservationStatusUpdate(
    context: AuditContext,
    data: TrackReservationChangeData & {
      previousStatus: string;
      newStatus: string;
      reason?: string;
    }
  ): Promise<AdminAuditLog> {
    return this.trackAction(context, {
      action: 'RESERVATION_STATUS_UPDATE' as any,
      metadata: {
        ...data.metadata,
        reason: data.reason,
        statusChange: `${data.previousStatus} → ${data.newStatus}`,
      },
      newValues: {
        ...data.newValues,
        status: data.newStatus,
      },
      oldValues: {
        ...data.oldValues,
        status: data.previousStatus,
      },
      resourceId: data.reservationId,
      resourceType: 'RESERVATION' as any,
    });
  }

  async trackReservationCancel(
    context: AuditContext,
    data: TrackReservationChangeData & {
      cancelReason: string;
      refundAmount?: number;
      waiveCancellationFee?: boolean;
    }
  ): Promise<AdminAuditLog> {
    return this.trackAction(context, {
      action: 'RESERVATION_CANCEL' as any,
      metadata: {
        ...data.metadata,
        cancelReason: data.cancelReason,
        refundAmount: data.refundAmount,
        waiveCancellationFee: data.waiveCancellationFee,
      },
      newValues: data.newValues,
      oldValues: data.oldValues,
      resourceId: data.reservationId,
      resourceType: 'RESERVATION' as any,
    });
  }

  async trackReceiptVerification(
    context: AuditContext,
    data: {
      receiptId: string;
      action: 'RECEIPT_VERIFY' | 'RECEIPT_REGENERATE';
      oldValues?: Record<string, any>;
      newValues?: Record<string, any>;
      verificationNotes?: string;
      regenerationReason?: string;
    }
  ): Promise<AdminAuditLog> {
    return this.trackAction(context, {
      action: data.action as any,
      metadata: {
        regenerationReason: data.regenerationReason,
        verificationNotes: data.verificationNotes,
      },
      newValues: data.newValues,
      oldValues: data.oldValues,
      resourceId: data.receiptId,
      resourceType: 'RECEIPT' as any,
    });
  }

  async trackBulkOperation(
    context: AuditContext,
    data: {
      action: 'BULK_PAYMENT_UPDATE' | 'BULK_PAYMENT_REFUND';
      resourceIds: string[];
      operation: string;
      parameters: Record<string, any>;
      results: {
        successful: string[];
        failed: Array<{ id: string; error: string }>;
      };
    }
  ): Promise<AdminAuditLog> {
    return this.trackAction(context, {
      action: data.action as any,
      // Unique ID for bulk operation
      metadata: {
        failureCount: data.results.failed.length,
        operation: data.operation,
        parameters: data.parameters,
        results: data.results,
        successCount: data.results.successful.length,
        targetResourceIds: data.resourceIds,
        totalTargeted: data.resourceIds.length,
      },

      resourceId: `bulk-${Date.now()}`,
      resourceType: 'PAYMENT' as any,
    });
  }

  async getAuditLogs(filters: AuditLogFilters): Promise<PaginatedAuditLogs> {
    return auditLogRepository.findMany(filters);
  }

  async getAuditLogById(id: string): Promise<AdminAuditLog | null> {
    return auditLogRepository.findById(id) as any;
  }

  async getAuditLogStats(
    filters?: Omit<AuditLogFilters, 'page' | 'limit'>
  ): Promise<AuditLogStats> {
    return auditLogRepository.getStats(filters);
  }

  async getResourceAuditHistory(
    resourceType: AdminResourceType,
    resourceId: string
  ): Promise<AdminAuditLog[]> {
    return auditLogRepository.findByResource(resourceType as any, resourceId) as any;
  }

  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    return auditLogRepository.deleteOldLogs(daysToKeep);
  }

  static createContext(
    adminUserId: string,
    request?: {
      ip?: string;
      headers?: { 'user-agent'?: string };
    }
  ): AuditContext {
    return {
      adminUserId,
      ipAddress: request?.ip,
      userAgent: request?.headers?.['user-agent'],
    };
  }

  static withAuditContext<T extends (...args: any[]) => any>(context: AuditContext, fn: T): T {
    return ((...args: Parameters<T>) => {
      return fn.apply(null, [...args, context]);
    }) as T;
  }
}

export const adminAuditService = new AdminAuditService();
