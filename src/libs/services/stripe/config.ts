import { loadStripe, Stripe } from '@stripe/stripe-js';

import { STRIPE_APPEARANCE_OPTIONS, STRIPE_CONFIG } from './constants';

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
    }

    stripePromise = loadStripe(publishableKey, {
      apiVersion: STRIPE_CONFIG.API_VERSION,
      locale: STRIPE_CONFIG.LOCALE,
    });
  }

  return stripePromise;
};

export const STRIPE_ELEMENTS_OPTIONS = {
  appearance: STRIPE_APPEARANCE_OPTIONS,
  loader: 'auto' as const,
} as const;

export const PAYMENT_ELEMENT_OPTIONS = {
  layout: 'tabs' as const,
  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
} as const;

export const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: false,
  style: {
    base: {
      '::placeholder': {
        color: '#9ca3af',
      },
      color: '#1f2937',
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
} as const;
