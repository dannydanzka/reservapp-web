export const DATABASE_CONSTANTS = {
  // Timeouts (in milliseconds)
  CONNECTION_TIMEOUT: 30000,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,

  MAX_BULK_OPERATIONS: 100,

  MAX_PAGE_SIZE: 100,

  // Retry settings
  MAX_RETRIES: 3,

  // Limits
  MAX_SEARCH_RESULTS: 1000,

  MIN_PAGE_SIZE: 1,

  QUERY_TIMEOUT: 10000,
  RETRY_DELAY: 1000,
} as const;

export const USER_CONSTANTS = {
  EMAIL: {
    MAX_LENGTH: 255,
  },
  NAME: {
    MAX_LENGTH: 50,
    MIN_LENGTH: 2,
  },
  PASSWORD: {
    MAX_LENGTH: 128,
    MIN_LENGTH: 8,
  },
  PHONE: {
    MAX_LENGTH: 20,
  },
} as const;

export const VENUE_CONSTANTS = {
  ADDRESS: {
    MAX_LENGTH: 200,
  },
  CITY: {
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 2000,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  NAME: {
    MAX_LENGTH: 100,
    MIN_LENGTH: 2,
  },
  PHONE: {
    MAX_LENGTH: 20,
  },
} as const;

export const SERVICE_CONSTANTS = {
  CAPACITY: {
    MAX: 20,
    MIN: 1,
  },
  CODE: {
    MAX_LENGTH: 10,
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  IMAGES: {
    MAX_COUNT: 10,
  },
  PRICE: {
    MAX: 999999.99,
    MIN: 0,
  },
} as const;

export const RESERVATION_CONSTANTS = {
  ADVANCE_BOOKING_DAYS: {
    MAX: 365,
    MIN: 0,
  },
  GUESTS: {
    MAX: 20,
    MIN: 1,
  },
  NOTES: {
    MAX_LENGTH: 1000,
  },
} as const;

export const PAYMENT_CONSTANTS = {
  AMOUNT: {
    MAX: 999999.99,
    MIN: 0,
  },
  TRANSACTION_ID: {
    MAX_LENGTH: 100,
  },
} as const;
