'use client';

import React, { useState } from 'react';

import { CARD_ELEMENT_OPTIONS } from '@/libs/services/stripe/config';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { Button } from '../Button';
import { LoadingSpinner } from '../LoadingSpinner';

import {
  StyledCardContainer,
  StyledErrorMessage,
  StyledPaymentForm,
  StyledSuccessMessage,
} from './StripePaymentForm.styled';

interface StripePaymentFormProps {
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

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  billingDetails,
  className,
  clientSecret,
  currency,
  disabled = false,
  onError,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    if (disabled) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          billing_details: billingDetails || {},
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        onError?.(result.error.message || 'Payment failed');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        onSuccess?.(result.paymentIntent);
      } else {
        setError('Payment was not successful');
        onError?.('Payment was not successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <StyledPaymentForm className={className}>
        <StyledSuccessMessage>
          Payment successful! Thank you for your payment of {currency.toUpperCase()}{' '}
          {amount.toFixed(2)}.
        </StyledSuccessMessage>
      </StyledPaymentForm>
    );
  }

  return (
    <StyledPaymentForm className={className} onSubmit={handleSubmit}>
      <StyledCardContainer>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </StyledCardContainer>

      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}

      <Button
        disabled={!stripe || isProcessing || disabled}
        fullWidth
        size='large'
        type='submit'
        variant='contained'
      >
        {isProcessing ? (
          <>
            <LoadingSpinner size='small' />
            Processing...
          </>
        ) : (
          `Pay ${currency.toUpperCase()} ${amount.toFixed(2)}`
        )}
      </Button>
    </StyledPaymentForm>
  );
};

export { StripePaymentForm };
