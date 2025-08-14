import { SystemLogCategory, SystemLogLevel, UserRoleEnum } from '@prisma/client';

export interface SystemLogUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleEnum;
}

export interface SystemLogItem {
  id: string;
  level: SystemLogLevel;
  category: SystemLogCategory;
  eventType: string;
  message: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: UserRoleEnum;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  sessionId?: string;
  resourceType?: string;
  resourceId?: string;
  duration?: number;
  statusCode?: number;
  oldValues?: any;
  newValues?: any;
  metadata?: any;
  errorCode?: string;
  errorMessage?: string;
  stackTrace?: string;
  createdAt: Date;
  user?: SystemLogUser;
}

export interface SystemLogStats {
  totalLogs: number;
  byLevel: Record<SystemLogLevel, number>;
  byCategory: Record<SystemLogCategory, number>;
  recentErrors: number;
  criticalAlerts: number;
  averageResponseTime: number;
}

export interface SystemLogFilters {
  level: SystemLogLevel[];
  category: SystemLogCategory[];
  eventType: string;
  userId: string;
  dateFrom: string;
  dateTo: string;
  resourceType: string;
  resourceId: string;
  search: string;
}

export interface SystemLogsPageProps {
  // Props if needed
}

export interface LogDetailModalProps {
  isOpen: boolean;
  log: SystemLogItem | null;
  onClose: () => void;
}

export interface LogStatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export interface LogLevelBadgeProps {
  level: SystemLogLevel;
}

export interface LogCategoryBadgeProps {
  category: SystemLogCategory;
}
