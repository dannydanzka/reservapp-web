import { Resend } from 'resend';

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

      const emailData = {
        attachments: params.attachments,
        bcc: params.bcc ? (Array.isArray(params.bcc) ? params.bcc : [params.bcc]) : undefined,
        cc: params.cc ? (Array.isArray(params.cc) ? params.cc : [params.cc]) : undefined,
        from: params.from || this.getFromAddress(),
        headers: params.headers,
        html: params.html,
        react: params.react,
        reply_to: params.replyTo,
        subject: params.subject,
        tags: params.tags,
        text: params.text,
        to: Array.isArray(params.to) ? params.to : [params.to],
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

    return this.sendEmail({
      html,
      subject,
      tags: [
        { name: 'type', value: 'reservation_confirmation' },
        { name: 'reservation_id', value: data.reservationId },
      ],
      text,
      to: data.guestEmail,
    });
  }

  static async sendReservationCancellation(data: ReservationEmailData): Promise<EmailResponse> {
    const subject = `Cancelación de Reserva - ${data.reservationId}`;
    const html = this.generateReservationCancellationHTML(data);
    const text = this.generateReservationCancellationText(data);

    return this.sendEmail({
      html,
      subject,
      tags: [
        { name: 'type', value: 'reservation_cancellation' },
        { name: 'reservation_id', value: data.reservationId },
      ],
      text,
      to: data.guestEmail,
    });
  }

  static async sendPaymentConfirmation(data: PaymentEmailData): Promise<EmailResponse> {
    const subject = `Confirmación de Pago - Reserva ${data.reservationId}`;
    const html = this.generatePaymentConfirmationHTML(data);
    const text = this.generatePaymentConfirmationText(data);

    return this.sendEmail({
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
  }

  static async sendCheckInReminder(data: ReservationEmailData): Promise<EmailResponse> {
    const subject = `Recordatorio de Check-in - ${data.venueName}`;
    const html = this.generateCheckInReminderHTML(data);
    const text = this.generateCheckInReminderText(data);

    return this.sendEmail({
      html,
      subject,
      tags: [
        { name: 'type', value: 'checkin_reminder' },
        { name: 'reservation_id', value: data.reservationId },
      ],
      text,
      to: data.guestEmail,
    });
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

  static getResendInstance(): Resend {
    return resend;
  }
}
