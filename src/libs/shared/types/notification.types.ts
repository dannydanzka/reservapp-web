/**
 * Notification types and interfaces for the notification system
 */

export enum NotificationType {
  RESERVATION_CONFIRMATION = 'RESERVATION_CONFIRMATION',
  RESERVATION_CANCELLATION = 'RESERVATION_CANCELLATION',
  PAYMENT_CONFIRMATION = 'PAYMENT_CONFIRMATION',
  CHECK_IN_REMINDER = 'CHECK_IN_REMINDER',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  PROMOTION = 'PROMOTION',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationData {
  isRead?: boolean;
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

// Metadata interfaces for different notification types
export interface ReservationNotificationMetadata {
  reservationId: string;
  venueName: string;
  serviceName: string;
  checkInDate: string;
  checkOutDate?: string;
  totalAmount?: number;
  currency?: string;
  confirmationCode?: string;
}

export interface PaymentNotificationMetadata {
  reservationId: string;
  paymentId: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentDate: string;
}

export interface SystemAlertMetadata {
  alertLevel: 'info' | 'warning' | 'error';
  actionRequired?: boolean;
  expiresAt?: string;
}

export interface PromotionNotificationMetadata {
  promotionId: string;
  discountPercentage?: number;
  validUntil?: string;
  venueId?: string;
  serviceId?: string;
}
