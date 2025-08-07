export const STRIPE_CONFIG = {
  API_VERSION: '2024-11-20.acacia' as const,
  CURRENCY: 'usd' as const,
  LOCALE: 'en' as const,
  PAYMENT_METHOD_TYPES: ['card'] as const,
} as const;

export const STRIPE_PAYMENT_STATUS = {
  CANCELED: 'canceled',
  PROCESSING: 'processing',
  REQUIRES_ACTION: 'requires_action',
  REQUIRES_CAPTURE: 'requires_capture',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  SUCCEEDED: 'succeeded',
} as const;

export const STRIPE_SETUP_INTENT_STATUS = {
  CANCELED: 'canceled',
  PROCESSING: 'processing',
  REQUIRES_ACTION: 'requires_action',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  SUCCEEDED: 'succeeded',
} as const;

export const STRIPE_WEBHOOK_EVENTS = {
  CHARGE_FAILED: 'charge.failed',
  CHARGE_REFUNDED: 'charge.refunded',
  CHARGE_SUCCEEDED: 'charge.succeeded',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_DELETED: 'customer.deleted',
  CUSTOMER_UPDATED: 'customer.updated',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  PAYMENT_INTENT_CANCELED: 'payment_intent.canceled',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
  PAYMENT_INTENT_REQUIRES_ACTION: 'payment_intent.requires_action',
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_METHOD_ATTACHED: 'payment_method.attached',
  PAYMENT_METHOD_DETACHED: 'payment_method.detached',
  SETUP_INTENT_SETUP_FAILED: 'setup_intent.setup_failed',
  SETUP_INTENT_SUCCEEDED: 'setup_intent.succeeded',
} as const;

export const STRIPE_ERROR_CODES = {
  CARD_DECLINED: 'card_declined',
  EXPIRED_CARD: 'expired_card',
  INCORRECT_CVC: 'incorrect_cvc',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  INVALID_CVC: 'invalid_cvc',
  INVALID_EXPIRY_MONTH: 'invalid_expiry_month',
  INVALID_EXPIRY_YEAR: 'invalid_expiry_year',
  INVALID_NUMBER: 'invalid_number',
  PROCESSING_ERROR: 'processing_error',
  RATE_LIMIT: 'rate_limit',
} as const;

export const STRIPE_PAYMENT_METHOD_TYPES = [
  'card',
  'apple_pay',
  'google_pay',
  'paypal',
  'klarna',
  'afterpay_clearpay',
] as const;

export const STRIPE_CURRENCIES = {
  AUD: 'aud',
  CAD: 'cad',
  EUR: 'eur',
  GBP: 'gbp',
  JPY: 'jpy',
  MXN: 'mxn',
  USD: 'usd',
} as const;

export const STRIPE_REFUND_REASONS = {
  DUPLICATE: 'duplicate',
  FRAUDULENT: 'fraudulent',
  REQUESTED_BY_CUSTOMER: 'requested_by_customer',
} as const;

export const PAYMENT_INTENT_METADATA_KEYS = {
  CHECK_IN_DATE: 'checkInDate',
  CHECK_OUT_DATE: 'checkOutDate',
  GUEST_COUNT: 'guestCount',
  RESERVATION_ID: 'reservationId',
  SERVICE_ID: 'serviceId',
  USER_ID: 'userId',
  VENUE_ID: 'venueId',
} as const;

// Test card numbers for development
export const STRIPE_TEST_CARDS = {
  AMEX_SUCCESS: '378282246310005',
  DINERS_SUCCESS: '30569309025904',
  DISCOVER_SUCCESS: '6011111111111117',
  JCB_SUCCESS: '3530111333300000',
  MASTERCARD_SUCCESS: '5555555555554444',
  // Cards that require authentication (3D Secure)
  VISA_3D_SECURE: '4000002500003155',

  VISA_3D_SECURE_DECLINED: '4000008400001629',

  VISA_DECLINE: '4000000000000002',
  // Expired card
  VISA_EXPIRED: '4000000000000069',

  // Insufficient funds
  VISA_INSUFFICIENT_FUNDS: '4000000000009995',

  // Invalid CVC
  VISA_INVALID_CVC: '4000000000000127',

  VISA_SUCCESS: '4242424242424242',
} as const;

export const STRIPE_ENVIRONMENT = {
  LIVE: 'live',
  TEST: 'test',
} as const;

export const getStripeEnvironment = (): 'test' | 'live' => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  return publishableKey?.includes('pk_test_') ? STRIPE_ENVIRONMENT.TEST : STRIPE_ENVIRONMENT.LIVE;
};

export const isStripeTestMode = (): boolean => {
  return getStripeEnvironment() === STRIPE_ENVIRONMENT.TEST;
};

export const STRIPE_APPEARANCE_OPTIONS = {
  theme: 'stripe' as const,
  variables: {
    borderRadius: '8px',
    // Primary Purple from theme
    colorBackground: '#ffffff',
    colorDanger: '#ef4444',
    colorPrimary: '#8B5CF6',
    colorText: '#1f2937',
    fontFamily: '"Inter", system-ui, sans-serif',
    spacingUnit: '4px',
  },
} as const;

export type StripePaymentStatus =
  (typeof STRIPE_PAYMENT_STATUS)[keyof typeof STRIPE_PAYMENT_STATUS];
export type StripeSetupIntentStatus =
  (typeof STRIPE_SETUP_INTENT_STATUS)[keyof typeof STRIPE_SETUP_INTENT_STATUS];
export type StripeWebhookEvent = (typeof STRIPE_WEBHOOK_EVENTS)[keyof typeof STRIPE_WEBHOOK_EVENTS];
export type StripeErrorCode = (typeof STRIPE_ERROR_CODES)[keyof typeof STRIPE_ERROR_CODES];
export type StripePaymentMethodType = (typeof STRIPE_PAYMENT_METHOD_TYPES)[number];
export type StripeCurrency = (typeof STRIPE_CURRENCIES)[keyof typeof STRIPE_CURRENCIES];
export type StripeRefundReason = (typeof STRIPE_REFUND_REASONS)[keyof typeof STRIPE_REFUND_REASONS];
