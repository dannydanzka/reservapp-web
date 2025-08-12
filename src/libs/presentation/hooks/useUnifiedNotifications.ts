/**
 * Simple useUnifiedNotifications hook - Temporary implementation
 */

export const useUnifiedNotifications = () => {
  return {
    error: null,
    loading: false,
    markAllAsRead: () => {},
    markAsRead: () => {},
    notifications: [],
    unreadCount: 0,
  };
};
