// Admin Types - Types for admin-related functionality
import type {
  AdminActionType as PrismaAdminActionType,
  AdminAuditLog as PrismaAdminAuditLogType,
  AdminResourceType as PrismaAdminResourceType,
} from '@prisma/client';

// Permission constants
export enum ACTIONS {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE',
  EXECUTE = 'EXECUTE',
}

export enum MODULES {
  USER = 'USER',
  VENUE = 'VENUE',
  RESERVATION = 'RESERVATION',
  PAYMENT = 'PAYMENT',
  SERVICE = 'SERVICE',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  ADMIN = 'ADMIN',
  REPORT = 'REPORT',
  AUDIT = 'AUDIT',
}

export interface PermissionCheckContext {
  userId: string;
  userRole?: string;
  venueId?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

export interface AdminPaymentView {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  userName: string;
  userEmail: string;
  venueName: string;
  serviceName: string;
  reservationId: string;
  createdAt: string;
  paymentMethod?: {
    type: string;
    brand?: string;
    last4?: string;
  };
}

export interface AdminPaymentStats {
  totalAmount: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  pendingAmount: number;
  completedAmount: number;
  failedAmount: number;
  refundedAmount: number;
  averageAmount: number;
  successRate: number;
}

export interface AdminPaymentFilters {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  venueId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface AdminVenueOption {
  id: string;
  name: string;
}

export interface PaginatedAdminPayments {
  data: AdminPaymentView[];
  hasMore: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export interface AdminPaymentAction {
  id: string;
  label: string;
  type: 'refund' | 'status' | 'view';
  enabled: boolean;
}

// User Role Management Types
export interface AssignRoleData {
  userId: string;
  roleId: string;
  grantedBy: string;
  venueId?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  venueId?: string;
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
  role: {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    isSystemRole: boolean;
  };
  venue?: {
    id: string;
    name: string;
  };
  grantor: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface UserRoleFilters {
  userId?: string;
  roleId?: string;
  venueId?: string;
  isActive?: boolean;
  includeExpired?: boolean;
  expiresAt?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserWithRoles {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  userRole?: string;
  isActive: boolean;
  createdAt: Date;
  userRoles: UserRoleAssignment[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  module: string;
  isSystemPerm?: boolean;
}

export interface PermissionFilters {
  module?: string;
  action?: string;
  resource?: string;
  isSystemPerm?: boolean;
  search?: string;
}

// Audit Log Types
export type AdminActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ROLE_ASSIGN'
  | 'ROLE_REVOKE'
  | 'PAYMENT_REFUND'
  | 'RESERVATION_CANCEL'
  | 'BULK_PAYMENT_UPDATE'
  | 'SYSTEM_CONFIG_CHANGE'
  | 'DATA_EXPORT'
  | 'SECURITY_EVENT';

export type AdminResourceType =
  | 'USER'
  | 'VENUE'
  | 'RESERVATION'
  | 'PAYMENT'
  | 'SERVICE'
  | 'ROLE'
  | 'PERMISSION'
  | 'SYSTEM'
  | 'AUDIT_LOG';

export interface AdminAuditLog {
  id: string;
  adminUserId: string;
  action: PrismaAdminActionType;
  resourceType: PrismaAdminResourceType;
  resourceId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateAuditLogData {
  adminUserId: string;
  action: PrismaAdminActionType;
  resourceType: PrismaAdminResourceType;
  resourceId?: string;
  description: string;
  metadata?: Record<string, any>;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  adminUserId?: string;
  action?: PrismaAdminActionType;
  resourceType?: PrismaAdminResourceType;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  dateFrom?: string;
  dateTo?: string;
  ipAddress?: string;
  search?: string;
}

export interface AuditLogStats {
  totalLogs?: number;
  actionCounts?: Record<PrismaAdminActionType, number>;
  resourceCounts?: Record<PrismaAdminResourceType, number>;
  uniqueAdmins?: number;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  actionsToday?: number;
  topActions?: Array<{
    action: PrismaAdminActionType;
    count: number;
  }>;
  topAdmins?: Array<{
    adminUserId: string;
    adminUserName: string;
    count: number;
  }>;
  totalActions?: number;
}

export interface PaginatedAuditLogs {
  data: PrismaAdminAuditLogType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
