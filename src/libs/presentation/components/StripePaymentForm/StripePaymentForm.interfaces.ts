/**
 * StripePaymentForm Component Interfaces
 *
 * TypeScript interfaces for the StripePaymentForm component.
 */

export interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
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
}
