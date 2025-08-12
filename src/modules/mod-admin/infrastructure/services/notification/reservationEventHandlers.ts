import { NotificationType } from '@shared/types/notification.types';

import { UnifiedNotificationService } from './unifiedNotificationService';

/**
 * Event handlers for reservation lifecycle events
 * These functions should be called from your reservation management logic
 */

export class ReservationEventHandlers {
  private static readonly unifiedService = UnifiedNotificationService.getInstance();

  /**
   * Handle reservation creation - sends confirmation to user and alert to admin
   */
  static async onReservationCreated(reservationData: {
    reservationId: string;
    userId: string;
    guestName: string;
    guestEmail: string;
    venueName: string;
    serviceNumber: string;
    serviceName: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    currency: string;
    confirmationCode?: string;
    specialRequests?: string;
    adminUserId?: string;
    adminEmail?: string;
  }) {
    try {
      // Send confirmation to guest
      const guestConfirmation = await this.unifiedService.sendReservationConfirmation({
        checkInDate: reservationData.checkInDate,
        checkOutDate: reservationData.checkOutDate,
        confirmationCode: reservationData.confirmationCode,
        currency: reservationData.currency,
        guestEmail: reservationData.guestEmail,
        guestName: reservationData.guestName,
        reservationId: reservationData.reservationId,
        serviceName: reservationData.serviceName,
        serviceNumber: reservationData.serviceNumber,
        specialRequests: reservationData.specialRequests,
        totalAmount: reservationData.totalAmount,
        userId: reservationData.userId,
        venueName: reservationData.venueName,
      });

      console.log('Guest confirmation result:', guestConfirmation);

      // Send alert to admin (if admin info is provided)
      if (reservationData.adminUserId && reservationData.adminEmail) {
        const adminAlert = await this.unifiedService.sendAdminNotification({
          adminEmail: reservationData.adminEmail,
          adminUserId: reservationData.adminUserId,
          message: `Nueva reserva confirmada en ${reservationData.venueName} para ${reservationData.guestName}. Total: ${reservationData.currency.toUpperCase()} $${reservationData.totalAmount.toFixed(2)}`,
          metadata: {
            currency: reservationData.currency,
            guestName: reservationData.guestName,
            reservationId: reservationData.reservationId,
            totalAmount: reservationData.totalAmount,
            venueName: reservationData.venueName,
          },
          subject: `Nueva Reserva - ${reservationData.reservationId}`,
          type: NotificationType.RESERVATION_CONFIRMATION,
        });

        console.log('Admin alert result:', adminAlert);
      }

      return {
        adminNotified: Boolean(reservationData.adminUserId && reservationData.adminEmail),
        guestNotified: guestConfirmation.success,
        success: true,
      };
    } catch (error) {
      console.error('Error handling reservation created event:', error);
      throw error;
    }
  }

  /**
   * Handle reservation cancellation
   */
  static async onReservationCancelled(reservationData: {
    reservationId: string;
    userId: string;
    guestName: string;
    guestEmail: string;
    venueName: string;
    serviceNumber: string;
    serviceName: string;
    checkInDate: string;
    checkOutDate: string;
    adminUserId?: string;
    adminEmail?: string;
  }) {
    try {
      // Send cancellation confirmation to guest
      const guestCancellation = await this.unifiedService.sendReservationCancellation({
        checkInDate: reservationData.checkInDate,
        checkOutDate: reservationData.checkOutDate,
        currency: 'MXN',
        guestEmail: reservationData.guestEmail,
        guestName: reservationData.guestName,
        reservationId: reservationData.reservationId,
        serviceName: reservationData.serviceName,
        serviceNumber: reservationData.serviceNumber,
        totalAmount: 0,
        userId: reservationData.userId,
        venueName: reservationData.venueName,
      });

      console.log('Guest cancellation result:', guestCancellation);

      // Notify admin about cancellation
      if (reservationData.adminUserId && reservationData.adminEmail) {
        const adminAlert = await this.unifiedService.sendAdminNotification({
          adminEmail: reservationData.adminEmail,
          adminUserId: reservationData.adminUserId,
          message: `La reserva en ${reservationData.venueName} para ${reservationData.guestName} ha sido cancelada.`,
          metadata: {
            guestName: reservationData.guestName,
            reservationId: reservationData.reservationId,
            venueName: reservationData.venueName,
          },
          subject: `Reserva Cancelada - ${reservationData.reservationId}`,
          type: NotificationType.RESERVATION_CANCELLATION,
        });

        console.log('Admin cancellation alert result:', adminAlert);
      }

      return {
        adminNotified: Boolean(reservationData.adminUserId && reservationData.adminEmail),
        guestNotified: guestCancellation.success,
        success: true,
      };
    } catch (error) {
      console.error('Error handling reservation cancellation event:', error);
      throw error;
    }
  }

  /**
   * Handle payment confirmation
   */
  static async onPaymentConfirmed(paymentData: {
    reservationId: string;
    userId: string;
    guestName: string;
    guestEmail: string;
    paymentAmount: number;
    currency: string;
    paymentMethod: string;
    transactionId: string;
    paymentDate: string;
    adminUserId?: string;
    adminEmail?: string;
  }) {
    try {
      // Send payment confirmation to guest
      const guestConfirmation = await this.unifiedService.sendPaymentConfirmation({
        currency: paymentData.currency,
        guestEmail: paymentData.guestEmail,
        guestName: paymentData.guestName,
        paymentAmount: paymentData.paymentAmount,
        paymentDate: paymentData.paymentDate,
        paymentMethod: paymentData.paymentMethod,
        reservationId: paymentData.reservationId,
        transactionId: paymentData.transactionId,
        userId: paymentData.userId,
      });

      console.log('Guest payment confirmation result:', guestConfirmation);

      // Notify admin about payment
      if (paymentData.adminUserId && paymentData.adminEmail) {
        const adminAlert = await this.unifiedService.sendAdminNotification({
          adminEmail: paymentData.adminEmail,
          adminUserId: paymentData.adminUserId,
          message: `Pago confirmado para la reserva ${paymentData.reservationId}. Monto: ${paymentData.currency.toUpperCase()} $${paymentData.paymentAmount.toFixed(2)}`,
          metadata: {
            currency: paymentData.currency,
            paymentAmount: paymentData.paymentAmount,
            reservationId: paymentData.reservationId,
            transactionId: paymentData.transactionId,
          },
          subject: `Pago Confirmado - ${paymentData.reservationId}`,
          type: NotificationType.PAYMENT_CONFIRMATION,
        });

        console.log('Admin payment alert result:', adminAlert);
      }

      return {
        adminNotified: Boolean(paymentData.adminUserId && paymentData.adminEmail),
        guestNotified: guestConfirmation.success,
        success: true,
      };
    } catch (error) {
      console.error('Error handling payment confirmation event:', error);
      throw error;
    }
  }

  /**
   * Send check-in reminder (typically called by a cron job 1 day before check-in)
   */
  static async sendCheckInReminder(reminderData: {
    reservationId: string;
    userId: string;
    guestName: string;
    guestEmail: string;
    venueName: string;
    serviceNumber: string;
    serviceName: string;
    checkInDate: string;
    checkOutDate: string;
  }) {
    try {
      const reminderResult = await this.unifiedService.sendCheckInReminder({
        checkInDate: reminderData.checkInDate,
        checkOutDate: reminderData.checkOutDate,
        currency: 'MXN',
        guestEmail: reminderData.guestEmail,
        guestName: reminderData.guestName,
        reservationId: reminderData.reservationId,
        serviceName: reminderData.serviceName,
        serviceNumber: reminderData.serviceNumber,
        totalAmount: 0,
        userId: reminderData.userId,
        venueName: reminderData.venueName,
      });

      console.log('Check-in reminder result:', reminderResult);

      return {
        reminderSent: reminderResult.success,
        success: true,
      };
    } catch (error) {
      console.error('Error sending check-in reminder:', error);
      throw error;
    }
  }
}
