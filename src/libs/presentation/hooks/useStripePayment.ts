import { useCallback, useState } from 'react';

import type { PaymentIntent, StripeError } from '@stripe/stripe-js';
import { useElements, useStripe } from '@stripe/react-stripe-js';

import { useStripe as useStripeService } from './useStripe';

interface UseStripePaymentReturn {
  processPayment: (
    clientSecret: string,
    paymentMethodOptions?: PaymentMethodOptions
  ) => Promise<PaymentResult>;
  isProcessing: boolean;
  error: string | null;
  paymentIntent: PaymentIntent | null;
}

interface PaymentMethodOptions {
  paymentMethodType?: 'card' | 'apple_pay' | 'google_pay';
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
  savePaymentMethod?: boolean;
}

interface PaymentResult {
  success: boolean;
  paymentIntent?: PaymentIntent;
  error?: StripeError;
  requiresAction?: boolean;
}

export const useStripePayment = (): UseStripePaymentReturn => {
  const stripe = useStripe();
  const elements = useElements();
  const { error: stripeServiceError } = useStripeService();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);

  const processPayment = useCallback(
    async (
      clientSecret: string,
      paymentMethodOptions: PaymentMethodOptions = {}
    ): Promise<PaymentResult> => {
      if (!stripe || !elements) {
        const errorMessage = 'Stripe has not been initialized properly';
        setError(errorMessage);
        return {
          error: { message: errorMessage, type: 'validation_error' } as StripeError,
          success: false,
        };
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Get the card element
        const cardElement = elements.getElement('card');
        if (!cardElement && paymentMethodOptions.paymentMethodType === 'card') {
          const errorMessage = 'Card element not found';
          setError(errorMessage);
          return {
            error: { message: errorMessage, type: 'validation_error' } as StripeError,
            success: false,
          };
        }

        // Confirm the payment
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            billing_details: paymentMethodOptions.billingDetails || {},
            card: cardElement!,
          },
          setup_future_usage: paymentMethodOptions.savePaymentMethod ? 'off_session' : undefined,
        });

        if (result.error) {
          setError(result.error.message || 'Payment failed');
          return {
            error: result.error,
            success: false,
          };
        }

        if (result.paymentIntent) {
          setPaymentIntent(result.paymentIntent);

          // Check if payment requires additional action
          if (result.paymentIntent.status === 'requires_action') {
            return {
              paymentIntent: result.paymentIntent,
              requiresAction: true,
              success: false,
            };
          }

          // Payment succeeded
          if (result.paymentIntent.status === 'succeeded') {
            return {
              paymentIntent: result.paymentIntent,
              success: true,
            };
          }
        }

        // Handle other statuses
        const errorMessage = `Payment status: ${result.paymentIntent?.status || 'unknown'}`;
        setError(errorMessage);
        return {
          error: { message: errorMessage, type: 'api_error' } as StripeError,
          paymentIntent: result.paymentIntent,
          success: false,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        return {
          error: { message: errorMessage, type: 'api_error' } as StripeError,
          success: false,
        };
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements]
  );

  return {
    error: error || stripeServiceError,
    isProcessing,
    paymentIntent,
    processPayment,
  };
};

export const useStripeSetupIntent = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupPaymentMethod = useCallback(
    async (clientSecret: string, billingDetails?: PaymentMethodOptions['billingDetails']) => {
      if (!stripe || !elements) {
        const errorMessage = 'Stripe has not been initialized properly';
        setError(errorMessage);
        return { error: errorMessage, success: false };
      }

      setIsProcessing(true);
      setError(null);

      try {
        const cardElement = elements.getElement('card');
        if (!cardElement) {
          const errorMessage = 'Card element not found';
          setError(errorMessage);
          return { error: errorMessage, success: false };
        }

        const result = await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            billing_details: billingDetails || {},
            card: cardElement,
          },
        });

        if (result.error) {
          setError(result.error.message || 'Setup failed');
          return { error: result.error.message, success: false };
        }

        return {
          paymentMethod: result.setupIntent?.payment_method,
          setupIntent: result.setupIntent,
          success: true,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        return { error: errorMessage, success: false };
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements]
  );

  return {
    error,
    isProcessing,
    setupPaymentMethod,
  };
};
