import type { AdminNotification } from '@mod-admin/infrastructure/services/admin/adminNotificationService';

export interface NotificationTableProps {
  notifications: AdminNotification[];
  loading: boolean;
  isRefreshing?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  selectedNotifications: string[];
  onPageChange: (page: number) => void;
  onNotificationSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onMarkAsRead: (ids: string[]) => void;
  onMarkAsUnread: (ids: string[]) => void;
  onBulkAction: (action: 'read' | 'unread', ids: string[]) => void;
}

export interface NotificationTypeConfig {
  label: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  icon: string;
}

export interface NotificationStatusConfig {
  read: {
    label: string;
    color: 'secondary';
  };
  unread: {
    label: string;
    color: 'primary';
  };
}
