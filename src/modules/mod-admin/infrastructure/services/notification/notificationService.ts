import {
  CreateNotificationData,
  Notification,
  NotificationFilters,
  NotificationListResponse,
  NotificationType,
  PaymentNotificationMetadata,
  ReservationNotificationMetadata,
} from '@shared/types/notification.types';
import {
  PaymentEmailData,
  ReservationEmailData,
} from '@libs/infrastructure/services/core/email/resendService';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';

/**
 * Service for managing notifications
 * Integrates with the existing email system to create in-app notifications
 */
export class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    // Use the imported prisma client directly
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Creates a new notification
   */
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      const notification = await prisma.notification.create({
        data: {
          isRead: false,
          message: data.message,
          metadata: data.metadata || null,
          title: data.title,
          type: data.type,
          userId: data.userId,
        },
      });

      return this.mapPrismaNotificationToDomain(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Gets notifications for a user with pagination and filtering
   */
  async getNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters: NotificationFilters = {}
  ): Promise<NotificationListResponse> {
    try {
      const offset = (page - 1) * limit;

      // Build where clause
      const where: any = {
        userId: userId,
      };

      if (filters.type) {
        where.type = filters.type;
      }

      if (filters.isRead !== undefined) {
        where.isRead = filters.isRead;
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

      // Get notifications with pagination
      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          skip: offset,
          take: limit,
          where,
        }),
        prisma.notification.count({ where }),
      ]);

      const mappedNotifications = notifications.map(this.mapPrismaNotificationToDomain);

      return {
        hasMore: total > offset + limit,
        limit,
        notifications: mappedNotifications,
        page,
        total,
      };
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw new Error('Failed to get notifications');
    }
  }

  /**
   * Gets a single notification by ID
   */
  async getNotificationById(id: string, userId: string): Promise<Notification | null> {
    try {
      const notification = await prisma.notification.findFirst({
        where: {
          id,
          userId,
        },
      });

      return notification ? this.mapPrismaNotificationToDomain(notification) : null;
    } catch (error) {
      console.error('Error getting notification by ID:', error);
      throw new Error('Failed to get notification');
    }
  }

  /**
   * Marks a notification as read
   */
  async markAsRead(id: string, userId: string): Promise<Notification> {
    try {
      const notification = await prisma.notification.updateMany({
        data: {
          isRead: true,
          updatedAt: new Date(),
        },
        where: {
          id,
          userId,
        },
      });

      if (notification.count === 0) {
        throw new Error('Notification not found or not authorized');
      }

      const updatedNotification = await this.getNotificationById(id, userId);
      if (!updatedNotification) {
        throw new Error('Failed to get updated notification');
      }

      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Marks all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await prisma.notification.updateMany({
        data: {
          isRead: true,
          updatedAt: new Date(),
        },
        where: {
          isRead: false,
          userId,
        },
      });

      return result.count;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * Gets count of unread notifications for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          isRead: false,
          userId,
        },
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw new Error('Failed to get unread count');
    }
  }

  /**
   * Deletes a notification
   */
  async deleteNotification(id: string, userId: string): Promise<void> {
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          id,
          userId,
        },
      });

      if (result.count === 0) {
        throw new Error('Notification not found or not authorized');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * Creates a reservation confirmation notification
   */
  async createReservationConfirmationNotification(
    userId: string,
    data: ReservationEmailData
  ): Promise<Notification> {
    const metadata: ReservationNotificationMetadata = {
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      confirmationCode: data.confirmationCode,
      currency: data.currency,
      reservationId: data.reservationId,
      serviceName: data.serviceName,
      totalAmount: data.totalAmount,
      venueName: data.venueName,
    };

    return this.createNotification({
      message: `Su reserva en ${data.venueName} ha sido confirmada. ID: ${data.reservationId}`,
      metadata,
      title: 'Reserva Confirmada',
      type: NotificationType.RESERVATION_CONFIRMATION,
      userId,
    });
  }

  /**
   * Creates a reservation cancellation notification
   */
  async createReservationCancellationNotification(
    userId: string,
    data: ReservationEmailData
  ): Promise<Notification> {
    const metadata: ReservationNotificationMetadata = {
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      reservationId: data.reservationId,
      serviceName: data.serviceName,
      venueName: data.venueName,
    };

    return this.createNotification({
      message: `Su reserva en ${data.venueName} ha sido cancelada. ID: ${data.reservationId}`,
      metadata,
      title: 'Reserva Cancelada',
      type: NotificationType.RESERVATION_CANCELLATION,
      userId,
    });
  }

  /**
   * Creates a payment confirmation notification
   */
  async createPaymentConfirmationNotification(
    userId: string,
    data: PaymentEmailData
  ): Promise<Notification> {
    const metadata: PaymentNotificationMetadata = {
      amount: data.paymentAmount,
      currency: data.currency,
      paymentDate: data.paymentDate,
      paymentId: data.transactionId,
      paymentMethod: data.paymentMethod,
      reservationId: data.reservationId,
      transactionId: data.transactionId,
    };

    return this.createNotification({
      message: `Su pago de ${data.currency.toUpperCase()} $${data.paymentAmount.toFixed(2)} ha sido procesado exitosamente.`,
      metadata,
      title: 'Pago Confirmado',
      type: NotificationType.PAYMENT_CONFIRMATION,
      userId,
    });
  }

  /**
   * Creates a check-in reminder notification
   */
  async createCheckInReminderNotification(
    userId: string,
    data: ReservationEmailData
  ): Promise<Notification> {
    const metadata: ReservationNotificationMetadata = {
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      reservationId: data.reservationId,
      serviceName: data.serviceName,
      venueName: data.venueName,
    };

    return this.createNotification({
      message: `No olvide hacer check-in en ${data.venueName}. Su reserva es para hoy.`,
      metadata,
      title: 'Recordatorio de Check-in',
      type: NotificationType.CHECK_IN_REMINDER,
      userId,
    });
  }

  /**
   * Maps Prisma notification to domain notification
   */
  private mapPrismaNotificationToDomain(prismaNotification: any): Notification {
    return {
      createdAt: prismaNotification.createdAt.toISOString(),
      id: prismaNotification.id,
      isRead: prismaNotification.isRead,
      message: prismaNotification.message,
      metadata: prismaNotification.metadata || undefined,
      title: prismaNotification.title,
      type: prismaNotification.type as NotificationType,
      updatedAt: prismaNotification.updatedAt.toISOString(),
      userId: prismaNotification.userId,
    };
  }
}
