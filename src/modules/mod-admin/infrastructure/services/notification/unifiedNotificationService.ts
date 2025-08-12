import { CreateNotificationData, NotificationType } from '@shared/types/notification.types';
import {
  EmailResponse,
  PaymentEmailData,
  ResendService,
  ReservationEmailData,
} from '@libs/infrastructure/services/core/email/resendService';

import { NotificationService } from './notificationService';

/**
 * Unified Notification Service
 *
 * This service ensures that EVERY email sent through the system
 * automatically creates a corresponding in-app notification.
 *
 * Perfect for mobile apps where users need to see notifications
 * even if they missed the email.
 */
export class UnifiedNotificationService {
  private static instance: UnifiedNotificationService;
  private readonly notificationService: NotificationService;

  private constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): UnifiedNotificationService {
    if (!UnifiedNotificationService.instance) {
      UnifiedNotificationService.instance = new UnifiedNotificationService();
    }
    return UnifiedNotificationService.instance;
  }

  /**
   * Sends reservation confirmation email + creates in-app notification
   * This guarantees the user receives the info both via email and in the mobile app
   */
  async sendReservationConfirmation(data: ReservationEmailData): Promise<{
    email: EmailResponse;
    notification: any;
    success: boolean;
  }> {
    try {
      // Send email first
      const emailResult = await ResendService.sendReservationConfirmation(data);

      let notificationResult = null;

      // Create notification ALWAYS, regardless of email success
      // This ensures mobile users get notified even if email fails
      if (data.userId) {
        try {
          notificationResult =
            await this.notificationService.createReservationConfirmationNotification(
              data.userId,
              data
            );
        } catch (notificationError) {
          console.error(
            'Failed to create reservation confirmation notification:',
            notificationError
          );
          // Don't fail the entire operation if notification fails
        }
      }

      return {
        email: emailResult,
        notification: notificationResult,
        success: emailResult.success,
      };
    } catch (error) {
      console.error('Error in unified reservation confirmation:', error);
      throw error;
    }
  }

  /**
   * Sends reservation cancellation email + creates in-app notification
   */
  async sendReservationCancellation(data: ReservationEmailData): Promise<{
    email: EmailResponse;
    notification: any;
    success: boolean;
  }> {
    try {
      const emailResult = await ResendService.sendReservationCancellation(data);

      let notificationResult = null;
      if (data.userId) {
        try {
          notificationResult =
            await this.notificationService.createReservationCancellationNotification(
              data.userId,
              data
            );
        } catch (notificationError) {
          console.error(
            'Failed to create reservation cancellation notification:',
            notificationError
          );
        }
      }

      return {
        email: emailResult,
        notification: notificationResult,
        success: emailResult.success,
      };
    } catch (error) {
      console.error('Error in unified reservation cancellation:', error);
      throw error;
    }
  }

  /**
   * Sends payment confirmation email + creates in-app notification
   */
  async sendPaymentConfirmation(data: PaymentEmailData): Promise<{
    email: EmailResponse;
    notification: any;
    success: boolean;
  }> {
    try {
      const emailResult = await ResendService.sendPaymentConfirmation(data);

      let notificationResult = null;
      if (data.userId) {
        try {
          notificationResult = await this.notificationService.createPaymentConfirmationNotification(
            data.userId,
            data
          );
        } catch (notificationError) {
          console.error('Failed to create payment confirmation notification:', notificationError);
        }
      }

      return {
        email: emailResult,
        notification: notificationResult,
        success: emailResult.success,
      };
    } catch (error) {
      console.error('Error in unified payment confirmation:', error);
      throw error;
    }
  }

  /**
   * Sends check-in reminder email + creates in-app notification
   */
  async sendCheckInReminder(data: ReservationEmailData): Promise<{
    email: EmailResponse;
    notification: any;
    success: boolean;
  }> {
    try {
      const emailResult = await ResendService.sendCheckInReminder(data);

      let notificationResult = null;
      if (data.userId) {
        try {
          notificationResult = await this.notificationService.createCheckInReminderNotification(
            data.userId,
            data
          );
        } catch (notificationError) {
          console.error('Failed to create check-in reminder notification:', notificationError);
        }
      }

      return {
        email: emailResult,
        notification: notificationResult,
        success: emailResult.success,
      };
    } catch (error) {
      console.error('Error in unified check-in reminder:', error);
      throw error;
    }
  }

  /**
   * Creates custom notification (for mobile app without email)
   * Useful for in-app only notifications like "reservation approved by admin"
   */
  async createCustomNotification(data: CreateNotificationData): Promise<any> {
    try {
      return await this.notificationService.createNotification(data);
    } catch (error) {
      console.error('Error creating custom notification:', error);
      throw error;
    }
  }

  /**
   * Sends welcome email to new user + creates welcome notification
   */
  async sendWelcomeEmail(userData: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<{
    email: EmailResponse;
    notification: any;
    success: boolean;
  }> {
    try {
      // Send welcome email
      const emailResult = await ResendService.sendEmail({
        html: this.generateWelcomeEmailHTML(userData),
        subject: '¡Bienvenido a ReservApp!',
        tags: [
          { name: 'type', value: 'welcome_email' },
          { name: 'user_id', value: userData.userId },
        ],
        text: this.generateWelcomeEmailText(userData),
        to: userData.email,
      });

      // Create welcome notification
      let notificationResult = null;
      try {
        notificationResult = await this.notificationService.createNotification({
          message: `Hola ${userData.firstName}, tu cuenta ha sido creada exitosamente. ¡Explora los mejores servicios disponibles!`,
          metadata: {
            userEmail: userData.email,
            welcomeEmail: true,
          },
          title: '¡Bienvenido a ReservApp!',
          type: 'SYSTEM' as any,
          userId: userData.userId,
        });
      } catch (notificationError) {
        console.error('Failed to create welcome notification:', notificationError);
      }

      return {
        email: emailResult,
        notification: notificationResult,
        success: emailResult.success,
      };
    } catch (error) {
      console.error('Error in unified welcome email:', error);
      throw error;
    }
  }

  /**
   * Sends admin notification email + creates admin notification
   * For notifying admins about new reservations, cancellations, etc.
   */
  async sendAdminNotification(data: {
    adminUserId: string;
    adminEmail: string;
    subject: string;
    message: string;
    type: NotificationType;
    metadata?: any;
  }): Promise<{
    email: EmailResponse;
    notification: any;
    success: boolean;
  }> {
    try {
      // Send email to admin
      const emailResult = await ResendService.sendEmail({
        html: this.generateAdminNotificationHTML(data),
        subject: `[Admin] ${data.subject}`,
        tags: [
          { name: 'type', value: 'admin_notification' },
          { name: 'admin_id', value: data.adminUserId },
        ],
        text: this.generateAdminNotificationText(data),
        to: data.adminEmail,
      });

      // Create admin notification
      let notificationResult = null;
      try {
        notificationResult = await this.notificationService.createNotification({
          message: data.message,
          metadata: data.metadata,
          title: data.subject,
          type: data.type,
          userId: data.adminUserId,
        });
      } catch (notificationError) {
        console.error('Failed to create admin notification:', notificationError);
      }

      return {
        email: emailResult,
        notification: notificationResult,
        success: emailResult.success,
      };
    } catch (error) {
      console.error('Error in unified admin notification:', error);
      throw error;
    }
  }

  // Email template generators
  private generateWelcomeEmailHTML(userData: {
    firstName: string;
    lastName: string;
    email: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Bienvenido a ReservApp!</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6, #F97316); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a ReservApp!</h1>
            <p>Tu plataforma para reservas premium</p>
        </div>
        
        <div class="content">
            <p>Hola ${userData.firstName},</p>
            
            <p>¡Tu cuenta en ReservApp ha sido creada exitosamente!</p>
            
            <p>Ahora puedes:</p>
            <ul>
                <li>🏨 Reservar habitaciones en hoteles premium</li>
                <li>🍽️ Hacer reservas en los mejores restaurantes</li>
                <li>💆 Agendar citas en spas y centros de bienestar</li>
                <li>🎯 Descubrir tours y experiencias únicas</li>
                <li>🎉 Reservar espacios para eventos especiales</li>
            </ul>
            
            <p>Nuestra app móvil te mantendrá informado con notificaciones en tiempo real sobre tus reservas.</p>
            
            <p>¡Comienza a explorar los mejores servicios disponibles!</p>
        </div>
        
        <div class="footer">
            <p>Gracias por elegir ReservApp</p>
            <p>Este es un email automático, por favor no responda a este mensaje.</p>
        </div>
    </div>
</body>
</html>`;
  }

  private generateWelcomeEmailText(userData: { firstName: string; lastName: string }): string {
    return `
¡BIENVENIDO A RESERVAPP!

Hola ${userData.firstName},

¡Tu cuenta en ReservApp ha sido creada exitosamente!

Ahora puedes:
- 🏨 Reservar habitaciones en hoteles premium
- 🍽️ Hacer reservas en los mejores restaurantes  
- 💆 Agendar citas en spas y centros de bienestar
- 🎯 Descubrir tours y experiencias únicas
- 🎉 Reservar espacios para eventos especiales

Nuestra app móvil te mantendrá informado con notificaciones en tiempo real sobre tus reservas.

¡Comienza a explorar los mejores servicios disponibles!

---
Gracias por elegir ReservApp
Este es un email automático, por favor no responda a este mensaje.
    `.trim();
  }

  private generateAdminNotificationHTML(data: { subject: string; message: string }): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Admin] ${data.subject}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Notificación de Administrador</h1>
            <p>${data.subject}</p>
        </div>
        
        <div class="content">
            <p>${data.message}</p>
            
            <p>Revisa tu panel de administración para más detalles.</p>
        </div>
        
        <div class="footer">
            <p>ReservApp - Panel de Administración</p>
            <p>Este es un email automático, por favor no responda a este mensaje.</p>
        </div>
    </div>
</body>
</html>`;
  }

  private generateAdminNotificationText(data: { subject: string; message: string }): string {
    return `
[ADMIN] ${data.subject.toUpperCase()}

${data.message}

Revisa tu panel de administración para más detalles.

---
ReservApp - Panel de Administración
Este es un email automático, por favor no responda a este mensaje.
    `.trim();
  }

  /**
   * Get notification service for direct access to notification-only operations
   */
  getNotificationService(): NotificationService {
    return this.notificationService;
  }
}
