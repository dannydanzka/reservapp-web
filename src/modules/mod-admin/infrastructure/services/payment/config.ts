/**
 * Stripe Configuration
 * Basic configuration stub - payment system is temporarily disabled
 */

// Stub function for Stripe instance
export const getStripe = () => {
  throw new Error('Stripe service is temporarily disabled');
};

// Basic Stripe Elements options
export const STRIPE_ELEMENTS_OPTIONS = {
  amount: 1000,
  currency: 'mxn',
  mode: 'payment',
} as const;

export const PAYMENT_ELEMENT_OPTIONS = {
  layout: 'tabs',
} as const;

export const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      '::placeholder': {
        color: '#aab7c4',
      },
      color: '#424770',
      fontSize: '16px',
    },
  },
} as const;
