export const API_ROUTES = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
  },

  // Swagger Documentation
  DOCS: '/swagger',

  // Health Check
  HEALTH: '/health',

  // Payments
  PAYMENTS: {
    BASE: '/payments',
    BY_ID: (id: string) => `/payments/${id}`,
    BY_RESERVATION: (reservationId: string) => `/payments?reservationId=${reservationId}`,
    PROCESS: (id: string) => `/payments/${id}/process`,
    REFUND: (id: string) => `/payments/${id}/refund`,
    STATS: '/payments/stats',
  },

  // Reservations
  RESERVATIONS: {
    BASE: '/reservations',
    BY_ID: (id: string) => `/reservations/${id}`,
    CANCEL: (id: string) => `/reservations/${id}/cancel`,
    CHECK_IN: (id: string) => `/reservations/${id}/checkin`,
    CHECK_OUT: (id: string) => `/reservations/${id}/checkout`,
    STATS: '/reservations/stats',
    UPCOMING_CHECKINS: '/reservations/upcoming-checkins',
    UPCOMING_CHECKOUTS: '/reservations/upcoming-checkouts',
  },

  // Services
  SERVICES: {
    AVAILABILITY: '/services/availability',
    BASE: '/services',
    BY_ID: (id: string) => `/services/${id}`,
    BY_VENUE: (venueId: string) => `/services?venueId=${venueId}`,
    STATS: '/services/stats',
  },

  // File Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    IMAGES: '/upload/images',
    SERVICE_IMAGES: (serviceId: string) => `/upload/service/${serviceId}/images`,
  },

  // Users
  USERS: {
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
    STATS: '/users/stats',
  },

  // Venues
  VENUES: {
    BASE: '/venues',
    BY_CITY: '/venues/by-city',
    BY_ID: (id: string) => `/venues/${id}`,
    STATS: '/venues/stats',
  },
} as const;

export const HTTP_STATUS = {
  ACCEPTED: 202,
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  CREATED: 201,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  NO_CONTENT: 204,
  OK: 200,
  SERVICE_UNAVAILABLE: 503,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
} as const;

export const API_MESSAGES = {
  ERROR: {
    BAD_REQUEST: 'Bad request',
    FORBIDDEN: 'Access forbidden',
    INTERNAL_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    VALIDATION_ERROR: 'Validation error',
  },
  SUCCESS: {
    CREATED: 'Resource created successfully',
    DELETED: 'Resource deleted successfully',
    RETRIEVED: 'Resource retrieved successfully',
    UPDATED: 'Resource updated successfully',
  },
  VALIDATION: {
    INVALID_DATE: 'Invalid date format',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_FORMAT: (field: string) => `${field} has invalid format`,
    MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
    PASSWORDS_NOT_MATCH: 'Passwords do not match',
    REQUIRED_FIELD: (field: string) => `${field} is required`,
  },
} as const;

export const REQUEST_TIMEOUTS = {
  // 1 minute
  AUTH: 15000,

  DEFAULT: 30000,

  // 2 minutes
  DOWNLOAD: 60000,
  // 30 seconds
  UPLOAD: 120000, // 15 seconds
} as const;

export const CACHE_KEYS = {
  PAYMENTS: 'payments',
  RESERVATIONS: 'reservations',
  SERVICES: 'services',
  USER_PROFILE: 'user_profile',
  VENUES: 'venues',
} as const;

export const CACHE_DURATIONS = {
  // 15 minutes
  LONG: 60 * 60 * 1000,

  // 5 minutes
  MEDIUM: 15 * 60 * 1000,
  SHORT: 5 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;
