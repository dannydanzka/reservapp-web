/**
 * Notification Management Hook - Presentation Layer
 * Handles notification operations and state management
 */

import { useCallback, useEffect, useState } from 'react';

import {
  type AdminNotification,
  adminNotificationService,
  type BulkUpdateNotificationsRequest,
  type NotificationFilters,
  type NotificationStats,
  type NotificationStatsFilters,
  type PaginatedNotifications,
} from '@mod-admin/infrastructure/services/admin/adminNotificationService';

export interface UseNotificationManagementReturn {
  notifications: AdminNotification[];
  loading: boolean;
  error: string | null;
  stats: NotificationStats['data'] | null;
  filters: NotificationFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    totalNotifications: number;
    unreadCount: number;
    emailCount: number;
    systemCount: number;
  } | null;

  // Actions
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  fetchNotificationStats: (filters?: NotificationStatsFilters) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAsUnread: (notificationId: string) => Promise<boolean>;
  bulkMarkAsRead: (notificationIds: string[]) => Promise<boolean>;
  bulkMarkAsUnread: (notificationIds: string[]) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;

  // Filters & Pagination
  setFilters: (filters: NotificationFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;

  // Helper methods
  getNotificationTypes: () => Array<{ value: string; label: string }>;
  getEmailTypes: () => Array<{ value: string; label: string }>;

  // Selection state for bulk operations
  selectedNotifications: string[];
  setSelectedNotifications: (ids: string[]) => void;
  toggleNotificationSelection: (id: string) => void;
  selectAllNotifications: () => void;
  clearSelection: () => void;
}

export const useNotificationManagement = (): UseNotificationManagementReturn => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<NotificationStats['data'] | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    hasNext: false,
    hasPrev: false,
    limit: 20,
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState<{
    totalNotifications: number;
    unreadCount: number;
    emailCount: number;
    systemCount: number;
  } | null>(null);

  const fetchNotifications = useCallback(
    async (newFilters?: NotificationFilters) => {
      try {
        setLoading(true);
        setError(null);

        const activeFilters = newFilters || filters;
        const queryFilters = {
          ...activeFilters,
          limit: pagination.limit,
          page: pagination.page,
        };

        const response = await adminNotificationService.getNotifications(queryFilters);

        if (response.success) {
          setNotifications(response.data.notifications);
          setPagination(response.data.pagination);
          setSummary(response.data.summary);
        } else {
          throw new Error('Failed to fetch notifications');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
        setError(errorMessage);
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  const fetchNotificationStats = useCallback(async (statsFilters?: NotificationStatsFilters) => {
    try {
      setError(null);
      const response = await adminNotificationService.getNotificationStats(statsFilters);

      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error('Failed to fetch notification stats');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch notification stats';
      setError(errorMessage);
      console.error('Error fetching notification stats:', err);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await adminNotificationService.updateNotificationStatus(
        notificationId,
        true
      );

      if (response.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          )
        );
        // Update summary
        setSummary((prev) =>
          prev
            ? {
                ...prev,
                unreadCount: prev.unreadCount - 1,
              }
            : null
        );
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to mark notification as read';
      setError(errorMessage);
      return false;
    }
  }, []);

  const markAsUnread = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await adminNotificationService.updateNotificationStatus(
        notificationId,
        false
      );

      if (response.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: false } : notification
          )
        );
        // Update summary
        setSummary((prev) =>
          prev
            ? {
                ...prev,
                unreadCount: prev.unreadCount + 1,
              }
            : null
        );
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to mark notification as unread';
      setError(errorMessage);
      return false;
    }
  }, []);

  const bulkMarkAsRead = useCallback(
    async (notificationIds: string[]): Promise<boolean> => {
      try {
        setError(null);
        const response = await adminNotificationService.bulkUpdateNotifications({
          isRead: true,
          notificationIds,
        });

        if (response.success) {
          // Update local state
          setNotifications((prev) =>
            prev.map((notification) =>
              notificationIds.includes(notification.id)
                ? { ...notification, isRead: true }
                : notification
            )
          );
          // Update summary - count how many were actually unread before
          const unreadCount = notifications.filter(
            (n) => notificationIds.includes(n.id) && !n.isRead
          ).length;
          setSummary((prev) =>
            prev
              ? {
                  ...prev,
                  unreadCount: prev.unreadCount - unreadCount,
                }
              : null
          );
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to mark notifications as read';
        setError(errorMessage);
        return false;
      }
    },
    [notifications]
  );

  const bulkMarkAsUnread = useCallback(
    async (notificationIds: string[]): Promise<boolean> => {
      try {
        setError(null);
        const response = await adminNotificationService.bulkUpdateNotifications({
          isRead: false,
          notificationIds,
        });

        if (response.success) {
          // Update local state
          setNotifications((prev) =>
            prev.map((notification) =>
              notificationIds.includes(notification.id)
                ? { ...notification, isRead: false }
                : notification
            )
          );
          // Update summary - count how many were actually read before
          const readCount = notifications.filter(
            (n) => notificationIds.includes(n.id) && n.isRead
          ).length;
          setSummary((prev) =>
            prev
              ? {
                  ...prev,
                  unreadCount: prev.unreadCount + readCount,
                }
              : null
          );
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to mark notifications as unread';
        setError(errorMessage);
        return false;
      }
    },
    [notifications]
  );

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const response = await adminNotificationService.markAllAsRead(filters);

      if (response.success) {
        // Refresh notifications to get updated state
        await fetchNotifications();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      setError(errorMessage);
      return false;
    }
  }, [filters, fetchNotifications]);

  // Filter and pagination handlers
  const handleSetFilters = useCallback((newFilters: NotificationFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSelectedNotifications([]); // Clear selection when filters change
  }, []);

  const handleSetPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    setSelectedNotifications([]); // Clear selection when page changes
  }, []);

  const handleSetLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
    setSelectedNotifications([]); // Clear selection when limit changes
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSelectedNotifications([]);
  }, []);

  // Selection handlers
  const toggleNotificationSelection = useCallback((id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  }, []);

  const selectAllNotifications = useCallback(() => {
    setSelectedNotifications(notifications.map((n) => n.id));
  }, [notifications]);

  const clearSelection = useCallback(() => {
    setSelectedNotifications([]);
  }, []);

  // Helper methods
  const getNotificationTypes = useCallback(() => {
    return adminNotificationService.getNotificationTypes();
  }, []);

  const getEmailTypes = useCallback(() => {
    return adminNotificationService.getEmailTypes();
  }, []);

  // Load notifications on mount and when filters/pagination change
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    bulkMarkAsRead,

    bulkMarkAsUnread,

    clearFilters,

    clearSelection,

    error,

    fetchNotificationStats,

    // Actions
    fetchNotifications,

    filters,

    getEmailTypes,

    // Helper methods
    getNotificationTypes,

    loading,

    markAllAsRead,

    markAsRead,

    markAsUnread,

    notifications,

    pagination,

    selectAllNotifications,

    // Selection state
    selectedNotifications,

    // Filters & Pagination
    setFilters: handleSetFilters,

    setLimit: handleSetLimit,

    setPage: handleSetPage,

    setSelectedNotifications,

    stats,
    summary,
    toggleNotificationSelection,
  };
};
