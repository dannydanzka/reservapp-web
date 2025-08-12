'use client';

import React, { useState } from 'react';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { Button } from '../Button';
import { LoadingSpinner } from '../LoadingSpinner';
import type { StripePaymentFormProps } from './StripePaymentForm.interfaces';

import {
  StyledCardContainer,
  StyledErrorMessage,
  StyledPaymentForm,
  StyledSuccessMessage,
} from './StripePaymentForm.styled';

// Configuración para el elemento de tarjeta de Stripe
const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: false,
  style: {
    base: {
      '::placeholder': {
        color: '#aab7c4',
      },
      color: '#424770',
      fontFamily: 'Lato, Arial, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
    },
    invalid: {
      color: '#9e2146',
      iconColor: '#fa755a',
    },
  },
};

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  billingDetails,
  className,
  clientSecret,
  currency,
  disabled = false,
  onError = () => {},
  onSuccess = () => {},
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
      } else if (result.paymentIntent && result.paymentIntent?.status === 'succeeded') {
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
