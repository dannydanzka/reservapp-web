import { useCallback, useState } from 'react';

import { handleApiRequest } from '@/libs/services/api/client/handleApiRequest';
import { SendEmailParams } from '@/libs/services/email/resendService';

interface UseEmailReturn {
  isLoading: boolean;
  error: string | null;
  sendEmail: (params: SendEmailParams) => Promise<EmailSendResult | null>;
  sendReservationConfirmation: (
    reservationId: string,
    guestEmail?: string
  ) => Promise<EmailSendResult | null>;
  sendReservationCancellation: (
    reservationId: string,
    guestEmail?: string
  ) => Promise<EmailSendResult | null>;
  sendPaymentConfirmation: (
    paymentId: string,
    guestEmail?: string
  ) => Promise<EmailSendResult | null>;
  sendCheckInReminder: (
    reservationId: string,
    guestEmail?: string
  ) => Promise<EmailSendResult | null>;
  isEmailEnabled: boolean;
}

interface EmailSendResult {
  emailId: string;
  success: boolean;
  message?: string;
  recipients?: number;
  enabledStatus?: boolean;
}

interface EmailApiResponse {
  success: boolean;
  message: string;
  data: EmailSendResult;
  error?: string;
}

export const useEmail = (): UseEmailReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if emails are enabled from environment
  const isEmailEnabled = process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true';

  // Generic email sending function
  const sendEmail = useCallback(
    async (params: SendEmailParams): Promise<EmailSendResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest<EmailSendResult>({
          body: params,
          endpoint: '/emails/send',
          method: 'POST',
          timeout: 30000,
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
        setError(errorMessage);
        console.error('Error sending email:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Send reservation confirmation email
  const sendReservationConfirmation = useCallback(
    async (reservationId: string, guestEmail?: string): Promise<EmailSendResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest<EmailSendResult>({
          body: { guestEmail, reservationId },
          endpoint: '/emails/reservation-confirmation',
          method: 'POST',
          timeout: 30000,
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send reservation confirmation email';
        setError(errorMessage);
        console.error('Error sending reservation confirmation email:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Send reservation cancellation email
  const sendReservationCancellation = useCallback(
    async (reservationId: string, guestEmail?: string): Promise<EmailSendResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest<EmailSendResult>({
          body: { guestEmail, reservationId },
          endpoint: '/emails/reservation-cancellation',
          method: 'POST',
          timeout: 30000,
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send reservation cancellation email';
        setError(errorMessage);
        console.error('Error sending reservation cancellation email:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Send payment confirmation email
  const sendPaymentConfirmation = useCallback(
    async (paymentId: string, guestEmail?: string): Promise<EmailSendResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest<EmailSendResult>({
          body: { guestEmail, paymentId },
          endpoint: '/emails/payment-confirmation',
          method: 'POST',
          timeout: 30000,
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send payment confirmation email';
        setError(errorMessage);
        console.error('Error sending payment confirmation email:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Send check-in reminder email
  const sendCheckInReminder = useCallback(
    async (reservationId: string, guestEmail?: string): Promise<EmailSendResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest<EmailSendResult>({
          body: { guestEmail, reservationId },
          endpoint: '/emails/checkin-reminder',
          method: 'POST',
          timeout: 30000,
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send check-in reminder email';
        setError(errorMessage);
        console.error('Error sending check-in reminder email:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    error,
    isEmailEnabled,
    isLoading,
    sendCheckInReminder,
    sendEmail,
    sendPaymentConfirmation,
    sendReservationCancellation,
    sendReservationConfirmation,
  };
};
