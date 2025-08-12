'use client';

import React, { ReactNode } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Simple Stripe configuration
const STRIPE_ELEMENTS_OPTIONS = {
  appearance: {
    theme: 'stripe' as const,
  },
};

const getStripe = () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children, clientSecret }) => {
  const stripePromise = getStripe();

  const options = {
    ...STRIPE_ELEMENTS_OPTIONS,
    ...(clientSecret && { clientSecret }),
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export { StripeProvider };
