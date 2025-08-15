export interface NotificationsManagementProps {
  // This component doesn't need props as it manages its own state
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type FilterLevel = 'all' | 'unread' | 'read';

export interface NotificationTableProps {
  notifications: any[]; // Will be typed properly with AdminNotification
  loading: boolean;
  selectedNotifications: string[];
  onSelectNotification: (id: string) => void;
  onSelectAll: () => void;
  onBulkAction: (action: 'read' | 'unread', ids: string[]) => void;
}
