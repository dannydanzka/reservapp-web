import { Resend } from 'resend';

// import { NotificationService } from '../notifications/notificationService'; // Temporarily disabled

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
  headers?: Record<string, string>;
}

export interface EmailResponse {
  id: string;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ReservationEmailData {
  reservationId: string;
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
  userId?: string; // Optional for creating notifications
}

export interface PaymentEmailData {
  reservationId: string;
  guestName: string;
  guestEmail: string;
  paymentAmount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  userId?: string; // Optional for creating notifications
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  userType: 'USER' | 'BUSINESS';
  firstName?: string;
  lastName?: string;
  businessName?: string;
}

export class ResendService {
  static isEmailEnabled(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true';
  }

  static getFromEmail(): string {
    return process.env.RESEND_FROM_EMAIL || 'noreply@reservapp.com';
  }

  static getFromName(): string {
    return process.env.RESEND_FROM_NAME || 'ReservApp';
  }

  static getFromAddress(): string {
    const name = this.getFromName();
    const email = this.getFromEmail();
    return `${name} <${email}>`;
  }

  static async sendEmail(params: SendEmailParams): Promise<EmailResponse> {
    try {
      // Check if emails are enabled
      if (!this.isEmailEnabled()) {
        console.log('Email sending is disabled. Email would be sent to:', params.to);
        console.log('Subject:', params.subject);
        console.log(
          'Content preview:',
          params.text?.substring(0, 100) || params.html?.substring(0, 100)
        );

        return {
          id: 'disabled-' + Date.now(),
          message: 'Email sending is disabled (NEXT_PUBLIC_ENABLE_EMAILS=false)',
          success: true,
        };
      }

      // Para MVP: redirigir todos los emails al propietario pero mantener info del destinatario original
      const originalRecipient = Array.isArray(params.to) ? params.to[0] : params.to;
      const targetEmail = process.env.RESEND_TARGET_EMAIL || 'danny.danzka21@gmail.com';

      // Modificar el HTML para incluir información del destinatario original
      const modifiedHtml = params.html
        ? `<div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #0ea5e9;">
          <strong>📧 Email MVP - Destinatario Original:</strong> ${originalRecipient}
        </div>
        ${params.html}`
        : params.html;

      const emailData = {
        attachments: params.attachments,
        bcc: params.bcc ? (Array.isArray(params.bcc) ? params.bcc : [params.bcc]) : undefined,
        cc: params.cc ? (Array.isArray(params.cc) ? params.cc : [params.cc]) : undefined,
        from: params.from || this.getFromAddress(),
        headers: params.headers,
        html: modifiedHtml,
        react: params.react,
        reply_to: params.replyTo,
        subject: `[ReservApp - Para: ${originalRecipient}] ${params.subject}`,
        tags: params.tags,
        text: params.text
          ? `Email destinado a: ${originalRecipient}\n\n${params.text}`
          : params.text,
        to: [targetEmail],
      };

      const response = await resend.emails.send(emailData);

      if (response.error) {
        console.error('Resend email error:', response.error);
        return {
          error: response.error.message || 'Failed to send email',
          id: '',
          success: false,
        };
      }

      return {
        id: response.data?.id || '',
        message: 'Email sent successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        id: '',
        success: false,
      };
    }
  }

  static async sendReservationConfirmation(data: ReservationEmailData): Promise<EmailResponse> {
    const subject = `Confirmación de Reserva - ${data.reservationId}`;
    const html = this.generateReservationConfirmationHTML(data);
    const text = this.generateReservationConfirmationText(data);

    const emailResponse = await this.sendEmail({
      html,
      subject,
      tags: [
        { name: 'type', value: 'reservation_confirmation' },
        { name: 'reservation_id', value: data.reservationId },
      ],
      text,
      to: data.guestEmail,
    });

    // Create notification if email was sent successfully and userId is provided
    if (emailResponse.success && data.userId) {
      try {
        // const notificationService = NotificationService.getInstance(); // Temporarily disabled
        // await notificationService.createReservationConfirmationNotification(data.userId, data);
      } catch (error) {
        console.error('Error creating reservation confirmation notification:', error);
        // Don't fail the email operation if notification creation fails
      }
    }

    return emailResponse;
  }

  static async sendReservationCancellation(data: ReservationEmailData): Promise<EmailResponse> {
    const subject = `Cancelación de Reserva - ${data.reservationId}`;
    const html = this.generateReservationCancellationHTML(data);
    const text = this.generateReservationCancellationText(data);

    const emailResponse = await this.sendEmail({
      html,
      subject,
      tags: [
        { name: 'type', value: 'reservation_cancellation' },
        { name: 'reservation_id', value: data.reservationId },
      ],
      text,
      to: data.guestEmail,
    });

    // Create notification if email was sent successfully and userId is provided
    if (emailResponse.success && data.userId) {
      try {
        // const notificationService = NotificationService.getInstance(); // Temporarily disabled
        // await notificationService.createReservationCancellationNotification(data.userId, data);
      } catch (error) {
        console.error('Error creating reservation cancellation notification:', error);
        // Don't fail the email operation if notification creation fails
      }
    }

    return emailResponse;
  }

  static async sendPaymentConfirmation(data: PaymentEmailData): Promise<EmailResponse> {
    const subject = `Confirmación de Pago - Reserva ${data.reservationId}`;
    const html = this.generatePaymentConfirmationHTML(data);
    const text = this.generatePaymentConfirmationText(data);

    const emailResponse = await this.sendEmail({
      html,
      subject,
      tags: [
        { name: 'type', value: 'payment_confirmation' },
        { name: 'reservation_id', value: data.reservationId },
        { name: 'transaction_id', value: data.transactionId },
      ],
      text,
      to: data.guestEmail,
    });

    // Create notification if email was sent successfully and userId is provided
    if (emailResponse.success && data.userId) {
      try {
        // const notificationService = NotificationService.getInstance(); // Temporarily disabled
        // await notificationService.createPaymentConfirmationNotification(data.userId, data);
      } catch (error) {
        console.error('Error creating payment confirmation notification:', error);
        // Don't fail the email operation if notification creation fails
      }
    }

    return emailResponse;
  }

  static async sendCheckInReminder(data: ReservationEmailData): Promise<EmailResponse> {
    const subject = `Recordatorio de Check-in - ${data.venueName}`;
    const html = this.generateCheckInReminderHTML(data);
    const text = this.generateCheckInReminderText(data);

    const emailResponse = await this.sendEmail({
      html,
      subject,
      tags: [
        { name: 'type', value: 'checkin_reminder' },
        { name: 'reservation_id', value: data.reservationId },
      ],
      text,
      to: data.guestEmail,
    });

    // Create notification if email was sent successfully and userId is provided
    if (emailResponse.success && data.userId) {
      try {
        // const notificationService = NotificationService.getInstance(); // Temporarily disabled
        // await notificationService.createCheckInReminderNotification(data.userId, data);
      } catch (error) {
        console.error('Error creating check-in reminder notification:', error);
        // Don't fail the email operation if notification creation fails
      }
    }

    return emailResponse;
  }

  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResponse> {
    const isUser = data.userType === 'USER';
    const subject = isUser
      ? '¡Bienvenido a ReservApp! 🎉'
      : '¡Bienvenido a ReservApp para Negocios! 🏨';

    const html = isUser
      ? this.generateUserWelcomeHTML(data)
      : this.generateBusinessWelcomeHTML(data);

    const text = isUser
      ? this.generateUserWelcomeText(data)
      : this.generateBusinessWelcomeText(data);

    const emailResponse = await this.sendEmail({
      html,
      subject,
      tags: [
        { name: 'type', value: isUser ? 'user_welcome' : 'business_welcome' },
        { name: 'user_type', value: data.userType.toLowerCase() },
      ],
      text,
      to: data.userEmail,
    });

    return emailResponse;
  }

  // HTML Email Templates
  private static generateReservationConfirmationHTML(data: ReservationEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Reserva</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6, #F97316); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .reservation-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .amount { font-size: 24px; font-weight: bold; color: #8B5CF6; }
        .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Reserva Confirmada!</h1>
            <p>Gracias por elegir ${data.venueName}</p>
        </div>
        
        <div class="content">
            <p>Estimado/a ${data.guestName},</p>
            
            <p>Nos complace confirmar su reserva. A continuación encontrará todos los detalles:</p>
            
            <div class="reservation-details">
                <h3>Detalles de la Reserva</h3>
                <div class="detail-row">
                    <span><strong>ID de Reserva:</strong></span>
                    <span>${data.reservationId}</span>
                </div>
                ${
                  data.confirmationCode
                    ? `
                <div class="detail-row">
                    <span><strong>Código de Confirmación:</strong></span>
                    <span>${data.confirmationCode}</span>
                </div>
                `
                    : ''
                }
                <div class="detail-row">
                    <span><strong>Venue:</strong></span>
                    <span>${data.venueName}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Habitación:</strong></span>
                    <span>${data.serviceName} - ${data.serviceNumber}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Check-in:</strong></span>
                    <span>${data.checkInDate}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Check-out:</strong></span>
                    <span>${data.checkOutDate}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Total:</strong></span>
                    <span class="amount">${data.currency.toUpperCase()} $${data.totalAmount.toFixed(2)}</span>
                </div>
                ${
                  data.specialRequests
                    ? `
                <div class="detail-row">
                    <span><strong>Solicitudes Especiales:</strong></span>
                    <span>${data.specialRequests}</span>
                </div>
                `
                    : ''
                }
            </div>
            
            <p>Le recomendamos llegar al venue después de las 3:00 PM para el check-in. El check-out debe realizarse antes de las 11:00 AM.</p>
            
            <p>Si tiene alguna pregunta o necesita modificar su reserva, no dude en contactarnos.</p>
            
            <p>¡Esperamos darle la bienvenida pronto!</p>
        </div>
        
        <div class="footer">
            <p>Este es un email automático, por favor no responda a este mensaje.</p>
            <p>${this.getFromName()} - Sistema de Reservas</p>
        </div>
    </div>
</body>
</html>`;
  }

  private static generateReservationConfirmationText(data: ReservationEmailData): string {
    return `
¡RESERVA CONFIRMADA!

Estimado/a ${data.guestName},

Nos complace confirmar su reserva en ${data.venueName}.

DETALLES DE LA RESERVA:
- ID de Reserva: ${data.reservationId}
${data.confirmationCode ? `- Código de Confirmación: ${data.confirmationCode}\n` : ''}
- Venue: ${data.venueName}
- Habitación: ${data.serviceName} - ${data.serviceNumber}
- Check-in: ${data.checkInDate}
- Check-out: ${data.checkOutDate}
- Total: ${data.currency.toUpperCase()} $${data.totalAmount.toFixed(2)}
${data.specialRequests ? `- Solicitudes Especiales: ${data.specialRequests}\n` : ''}

Le recomendamos llegar al venue después de las 3:00 PM para el check-in. El check-out debe realizarse antes de las 11:00 AM.

Si tiene alguna pregunta o necesita modificar su reserva, no dude en contactarnos.

¡Esperamos darle la bienvenida pronto!

---
${this.getFromName()} - Sistema de Reservas
Este es un email automático, por favor no responda a este mensaje.
    `.trim();
  }

  private static generateReservationCancellationHTML(data: ReservationEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cancelación de Reserva</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .reservation-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reserva Cancelada</h1>
            <p>Su reserva ha sido cancelada exitosamente</p>
        </div>
        
        <div class="content">
            <p>Estimado/a ${data.guestName},</p>
            
            <p>Confirmamos que su reserva ha sido cancelada según su solicitud.</p>
            
            <div class="reservation-details">
                <h3>Detalles de la Reserva Cancelada</h3>
                <div class="detail-row">
                    <span><strong>ID de Reserva:</strong></span>
                    <span>${data.reservationId}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Venue:</strong></span>
                    <span>${data.venueName}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Fechas:</strong></span>
                    <span>${data.checkInDate} - ${data.checkOutDate}</span>
                </div>
            </div>
            
            <p>Si el pago ya fue procesado, el reembolso será procesado en los próximos 5-10 días hábiles.</p>
            
            <p>Esperamos poder servirle en una futura oportunidad.</p>
        </div>
        
        <div class="footer">
            <p>Este es un email automático, por favor no responda a este mensaje.</p>
            <p>${this.getFromName()} - Sistema de Reservas</p>
        </div>
    </div>
</body>
</html>`;
  }

  private static generateReservationCancellationText(data: ReservationEmailData): string {
    return `
RESERVA CANCELADA

Estimado/a ${data.guestName},

Confirmamos que su reserva ha sido cancelada según su solicitud.

DETALLES DE LA RESERVA CANCELADA:
- ID de Reserva: ${data.reservationId}
- Venue: ${data.venueName}
- Fechas: ${data.checkInDate} - ${data.checkOutDate}

Si el pago ya fue procesado, el reembolso será procesado en los próximos 5-10 días hábiles.

Esperamos poder servirle en una futura oportunidad.

---
${this.getFromName()} - Sistema de Reservas
Este es un email automático, por favor no responda a este mensaje.
    `.trim();
  }

  private static generatePaymentConfirmationHTML(data: PaymentEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pago</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .payment-details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .amount { font-size: 24px; font-weight: bold; color: #10b981; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Pago Confirmado!</h1>
            <p>Su pago ha sido procesado exitosamente</p>
        </div>
        
        <div class="content">
            <p>Estimado/a ${data.guestName},</p>
            
            <p>Confirmamos que hemos recibido su pago.</p>
            
            <div class="payment-details">
                <h3>Detalles del Pago</h3>
                <div class="detail-row">
                    <span><strong>ID de Reserva:</strong></span>
                    <span>${data.reservationId}</span>
                </div>
                <div class="detail-row">
                    <span><strong>ID de Transacción:</strong></span>
                    <span>${data.transactionId}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Método de Pago:</strong></span>
                    <span>${data.paymentMethod}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Fecha:</strong></span>
                    <span>${data.paymentDate}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Monto:</strong></span>
                    <span class="amount">${data.currency.toUpperCase()} $${data.paymentAmount.toFixed(2)}</span>
                </div>
            </div>
            
            <p>Conserve este email como comprobante de pago.</p>
            
            <p>¡Gracias por su confianza!</p>
        </div>
        
        <div class="footer">
            <p>Este es un email automático, por favor no responda a este mensaje.</p>
            <p>${this.getFromName()} - Sistema de Reservas</p>
        </div>
    </div>
</body>
</html>`;
  }

  private static generatePaymentConfirmationText(data: PaymentEmailData): string {
    return `
¡PAGO CONFIRMADO!

Estimado/a ${data.guestName},

Confirmamos que hemos recibido su pago.

DETALLES DEL PAGO:
- ID de Reserva: ${data.reservationId}
- ID de Transacción: ${data.transactionId}
- Método de Pago: ${data.paymentMethod}
- Fecha: ${data.paymentDate}
- Monto: ${data.currency.toUpperCase()} $${data.paymentAmount.toFixed(2)}

Conserve este email como comprobante de pago.

¡Gracias por su confianza!

---
${this.getFromName()} - Sistema de Reservas
Este es un email automático, por favor no responda a este mensaje.
    `.trim();
  }

  private static generateCheckInReminderHTML(data: ReservationEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recordatorio de Check-in</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .reservation-details { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bfdbfe; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Recordatorio de Check-in</h1>
            <p>Su estancia comienza pronto</p>
        </div>
        
        <div class="content">
            <p>Estimado/a ${data.guestName},</p>
            
            <p>Le recordamos que su check-in en ${data.venueName} es mañana. Esperamos darle la bienvenida.</p>
            
            <div class="reservation-details">
                <h3>Información de su Estancia</h3>
                <div class="detail-row">
                    <span><strong>ID de Reserva:</strong></span>
                    <span>${data.reservationId}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Venue:</strong></span>
                    <span>${data.venueName}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Habitación:</strong></span>
                    <span>${data.serviceName} - ${data.serviceNumber}</span>
                </div>
                <div class="detail-row">
                    <span><strong>Check-in:</strong></span>
                    <span>${data.checkInDate} (después de las 3:00 PM)</span>
                </div>
                <div class="detail-row">
                    <span><strong>Check-out:</strong></span>
                    <span>${data.checkOutDate} (antes de las 11:00 AM)</span>
                </div>
            </div>
            
            <p><strong>Información importante:</strong></p>
            <ul>
                <li>El check-in está disponible a partir de las 3:00 PM</li>
                <li>Traiga una identificación válida</li>
                <li>Si va a llegar tarde, por favor contáctenos</li>
            </ul>
            
            <p>¡Esperamos que disfrute su estancia!</p>
        </div>
        
        <div class="footer">
            <p>Este es un email automático, por favor no responda a este mensaje.</p>
            <p>${this.getFromName()} - Sistema de Reservas</p>
        </div>
    </div>
</body>
</html>`;
  }

  private static generateCheckInReminderText(data: ReservationEmailData): string {
    return `
RECORDATORIO DE CHECK-IN

Estimado/a ${data.guestName},

Le recordamos que su check-in en ${data.venueName} es mañana. Esperamos darle la bienvenida.

INFORMACIÓN DE SU ESTANCIA:
- ID de Reserva: ${data.reservationId}
- Venue: ${data.venueName}
- Habitación: ${data.serviceName} - ${data.serviceNumber}
- Check-in: ${data.checkInDate} (después de las 3:00 PM)
- Check-out: ${data.checkOutDate} (antes de las 11:00 AM)

INFORMACIÓN IMPORTANTE:
- El check-in está disponible a partir de las 3:00 PM
- Traiga una identificación válida
- Si va a llegar tarde, por favor contáctenos

¡Esperamos que disfrute su estancia!

---
${this.getFromName()} - Sistema de Reservas
Este es un email automático, por favor no responda a este mensaje.
    `.trim();
  }

  // Welcome Email Templates
  private static generateUserWelcomeHTML(data: WelcomeEmailData): string {
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
        .benefits { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0; }
        .benefit-item { padding: 10px 0; border-bottom: 1px solid #d1fae5; }
        .benefit-item:last-child { border-bottom: none; }
        .cta-button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #8B5CF6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a ReservApp! 🎉</h1>
            <p>Tu aventura de viajes únicos comienza aquí</p>
        </div>
        
        <div class="content">
            <p>¡Hola ${data.firstName || data.userName}!</p>
            
            <p>¡Gracias por unirte a ReservApp! Como usuario pionero, tienes acceso a experiencias de viaje únicas que no encontrarás en ninguna otra plataforma.</p>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">100+</div>
                    <div>Hoteles boutique únicos</div>
                </div>
                <div class="stat">
                    <div class="stat-number">500+</div>
                    <div>Experiencias locales</div>
                </div>
                <div class="stat">
                    <div class="stat-number">25%</div>
                    <div>Menos vs otras plataformas</div>
                </div>
            </div>
            
            <div class="benefits">
                <h3>🎁 Beneficios de Usuario Pionero:</h3>
                <div class="benefit-item">✅ Descuentos especiales en venues boutique</div>
                <div class="benefit-item">✅ Experiencias auténticas locales</div>
                <div class="benefit-item">✅ Comunidad privada de viajeros conscientes</div>
                <div class="benefit-item">✅ Soporte prioritario premium</div>
            </div>
            
            <p>Próximamente lanzaremos nuestra aplicación móvil con funcionalidades completas de reserva. ¡Serás el primero en saberlo!</p>
            
            <div style="text-align: center;">
                <a href="https://reservapp-web.vercel.app" class="cta-button">Explorar Destinos</a>
            </div>
        </div>
        
        <div class="footer">
            <p>¡Gracias por ser parte de la revolución del turismo local!</p>
            <p>${this.getFromName()} - Tu compañero de viajes únicos</p>
        </div>
    </div>
</body>
</html>`;
  }

  private static generateUserWelcomeText(data: WelcomeEmailData): string {
    return `
¡BIENVENIDO A RESERVAPP! 🎉

¡Hola ${data.firstName || data.userName}!

¡Gracias por unirte a ReservApp! Como usuario pionero, tienes acceso a experiencias de viaje únicas que no encontrarás en ninguna otra plataforma.

🏨 100+ Hoteles boutique únicos
🌟 500+ Experiencias locales exclusivas  
💰 25% Menos vs otras plataformas

🎁 BENEFICIOS DE USUARIO PIONERO:
✅ Descuentos especiales en venues boutique
✅ Experiencias auténticas locales
✅ Comunidad privada de viajeros conscientes
✅ Soporte prioritario premium

Próximamente lanzaremos nuestra aplicación móvil con funcionalidades completas de reserva. ¡Serás el primero en saberlo!

Explora destinos: https://reservapp-web.vercel.app

¡Gracias por ser parte de la revolución del turismo local!

---
${this.getFromName()} - Tu compañero de viajes únicos
    `.trim();
  }

  private static generateBusinessWelcomeHTML(data: WelcomeEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Bienvenido a ReservApp para Negocios!</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .benefits { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0; }
        .benefit-item { padding: 10px 0; border-bottom: 1px solid #d1fae5; }
        .benefit-item:last-child { border-bottom: none; }
        .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a ReservApp! 🏨</h1>
            <p>Tu socio estratégico para crecer tu negocio turístico</p>
        </div>
        
        <div class="content">
            <p>¡Hola ${data.businessName || data.userName}!</p>
            
            <p>¡Excelente decisión! Te has unido a la plataforma que está revolucionando el turismo en México, conectando pequeños venues y negocios turísticos con viajeros que buscan experiencias auténticas.</p>
            
            <div class="highlight">
                <strong>🚀 ¿Por qué ReservApp es diferente?</strong><br>
                Nos enfocamos en venues boutique y pequeños negocios, ofreciendo menor comisión, pagos más rápidos y herramientas de gestión integradas.
            </div>
            
            <div class="benefits">
                <h3>💼 Beneficios para tu Negocio:</h3>
                <div class="benefit-item">💰 Comisiones más bajas que la competencia</div>
                <div class="benefit-item">⚡ Pagos rápidos - sin esperas largas</div>
                <div class="benefit-item">📊 Panel de control completo</div>
                <div class="benefit-item">🎯 Marketing dirigido a nichos específicos</div>
                <div class="benefit-item">📞 Soporte dedicado 24/7</div>
                <div class="benefit-item">📱 Herramientas de gestión integradas</div>
            </div>
            
            <p><strong>Próximos pasos:</strong></p>
            <p>Nuestro equipo se pondrá en contacto contigo para ayudarte a configurar tu perfil de negocio y comenzar a recibir reservas.</p>
            
            <div style="text-align: center;">
                <a href="https://reservapp-web.vercel.app/admin" class="cta-button">Acceder al Panel</a>
            </div>
        </div>
        
        <div class="footer">
            <p>¡Juntos haremos crecer tu negocio turístico!</p>
            <p>${this.getFromName()} - Tu socio estratégico de crecimiento</p>
        </div>
    </div>
</body>
</html>`;
  }

  private static generateBusinessWelcomeText(data: WelcomeEmailData): string {
    return `
¡BIENVENIDO A RESERVAPP PARA NEGOCIOS! 🏨

¡Hola ${data.businessName || data.userName}!

¡Excelente decisión! Te has unido a la plataforma que está revolucionando el turismo en México, conectando pequeños venues y negocios turísticos con viajeros que buscan experiencias auténticas.

🚀 ¿POR QUÉ RESERVAPP ES DIFERENTE?
Nos enfocamos en venues boutique y pequeños negocios, ofreciendo menor comisión, pagos más rápidos y herramientas de gestión integradas.

💼 BENEFICIOS PARA TU NEGOCIO:
💰 Comisiones más bajas que la competencia
⚡ Pagos rápidos - sin esperas largas
📊 Panel de control completo
🎯 Marketing dirigido a nichos específicos
📞 Soporte dedicado 24/7
📱 Herramientas de gestión integradas

PRÓXIMOS PASOS:
Nuestro equipo se pondrá en contacto contigo para ayudarte a configurar tu perfil de negocio y comenzar a recibir reservas.

Panel de administración: https://reservapp-web.vercel.app/admin

¡Juntos haremos crecer tu negocio turístico!

---
${this.getFromName()} - Tu socio estratégico de crecimiento
    `.trim();
  }

  static getResendInstance(): Resend {
    return resend;
  }
}
