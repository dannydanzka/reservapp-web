'use client';

import React, { ReactNode } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { getStripe, STRIPE_ELEMENTS_OPTIONS } from '@/libs/services/stripe/config';

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
