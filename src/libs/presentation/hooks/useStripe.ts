import { useCallback, useState } from 'react';

import { handleApiRequest } from '@shared/utils/handleApiRequest';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

interface UseStripeReturn {
  stripe: Stripe | null;
  isLoading: boolean;
  error: string | null;
  createPaymentIntent: (
    data: CreatePaymentIntentData
  ) => Promise<CreatePaymentIntentResponse | null>;
  confirmPayment: (data: ConfirmPaymentData) => Promise<ConfirmPaymentResponse | null>;
  createCustomer: (data: CreateCustomerData) => Promise<CreateCustomerResponse | null>;
  createRefund: (data: CreateRefundData) => Promise<CreateRefundResponse | null>;
}

interface CreatePaymentIntentData {
  reservationId: string;
  amount: number;
  currency?: string;
  description?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

interface CreatePaymentIntentResponse {
  paymentId: string;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, string>;
}

interface ConfirmPaymentData {
  paymentIntentId: string;
  paymentMethodId: string;
}

interface ConfirmPaymentResponse {
  paymentId: string;
  paymentIntentId: string;
  status: string;
  amount: number;
  currency: string;
  requiresAction: boolean;
  nextAction?: any;
  clientSecret?: string;
}

interface CreateCustomerData {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

interface CreateCustomerResponse {
  customerId: string;
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

interface CreateRefundData {
  paymentId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, string>;
}

interface CreateRefundResponse {
  refundId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  reason?: string;
  isFullRefund: boolean;
  created: string;
}

export const useStripe = (): UseStripeReturn => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Stripe
  const initializeStripe = useCallback(async () => {
    try {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        throw new Error('Stripe publishable key is not configured');
      }

      const stripeInstance = await loadStripe(publishableKey);
      setStripe(stripeInstance);
      return stripeInstance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Stripe';
      setError(errorMessage);
      console.error('Error initializing Stripe:', err);
      return null;
    }
  }, []);

  // Create payment intent
  const createPaymentIntent = useCallback(
    async (data: CreatePaymentIntentData): Promise<CreatePaymentIntentResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest('/api/payments/create-intent', {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create payment intent';
        setError(errorMessage);
        console.error('Error creating payment intent:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Confirm payment
  const confirmPayment = useCallback(
    async (data: ConfirmPaymentData): Promise<ConfirmPaymentResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest('/api/payments/confirm', {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to confirm payment';
        setError(errorMessage);
        console.error('Error confirming payment:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Create customer
  const createCustomer = useCallback(
    async (data: CreateCustomerData): Promise<CreateCustomerResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest('/api/payments/customers', {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create customer';
        setError(errorMessage);
        console.error('Error creating customer:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Create refund
  const createRefund = useCallback(
    async (data: CreateRefundData): Promise<CreateRefundResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await handleApiRequest('/api/payments/refund', {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        return response?.data ?? null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create refund';
        setError(errorMessage);
        console.error('Error creating refund:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initialize Stripe on first use
  if (!stripe && !isLoading) {
    initializeStripe();
  }

  return {
    confirmPayment,
    createCustomer,
    createPaymentIntent,
    createRefund,
    error,
    isLoading,
    stripe,
  };
};
