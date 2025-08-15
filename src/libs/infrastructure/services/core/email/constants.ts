export const EMAIL_CONFIG = {
  FROM_EMAIL: 'noreply@reservapp.com',
  FROM_NAME: 'ReservApp',
  MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024,
  MAX_RECIPIENTS: 50,
  REPLY_TO: 'support@reservapp.com', // 10MB
} as const;

export const EMAIL_TEMPLATES = {
  CHECK_IN_REMINDER: 'checkin_reminder',
  CHECK_OUT_REMINDER: 'checkout_reminder',
  PASSWORD_RESET: 'password_reset',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  PAYMENT_FAILED: 'payment_failed',
  RESERVATION_CANCELLATION: 'reservation_cancellation',
  RESERVATION_CONFIRMATION: 'reservation_confirmation',
  WELCOME: 'welcome',
} as const;

export const EMAIL_TAGS = {
  CATEGORY: {
    AUTH: 'auth',
    PAYMENT: 'payment',
    REMINDER: 'reminder',
    RESERVATION: 'reservation',
  },
  PRIORITY: {
    HIGH: 'high',
    LOW: 'low',
    MEDIUM: 'medium',
  },
  TYPE: {
    MARKETING: 'marketing',
    NOTIFICATION: 'notification',
    TRANSACTIONAL: 'transactional',
  },
} as const;

export const EMAIL_STATUS = {
  BOUNCED: 'bounced',
  COMPLAINED: 'complained',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  PENDING: 'pending',
  SENT: 'sent',
} as const;

export const EMAIL_ERRORS = {
  AUTHENTICATION_FAILED: 'authentication_failed',
  INVALID_EMAIL: 'invalid_email',
  INVALID_TEMPLATE: 'invalid_template',
  MISSING_DATA: 'missing_data',
  QUOTA_EXCEEDED: 'quota_exceeded',
  RATE_LIMITED: 'rate_limited',
  SERVICE_UNAVAILABLE: 'service_unavailable',
} as const;

export const EMAIL_SUBJECTS = {
  CHECK_IN_REMINDER: 'Recordatorio de Check-in - #{venueName}',
  CHECK_OUT_REMINDER: 'Recordatorio de Check-out - #{venueName}',
  PASSWORD_RESET: 'Restablecimiento de Contraseña - ReservApp',
  PAYMENT_CONFIRMATION: 'Confirmación de Pago - Reserva #{reservationId}',
  PAYMENT_FAILED: 'Error en el Pago - Reserva #{reservationId}',
  RESERVATION_CANCELLATION: 'Cancelación de Reserva - #{reservationId}',
  RESERVATION_CONFIRMATION: 'Confirmación de Reserva - #{reservationId}',
  WELCOME: 'Bienvenido a ReservApp',
} as const;

export const EMAIL_CONTENT_TYPES = {
  HTML: 'text/html',
  MULTIPART: 'multipart/alternative',
  TEXT: 'text/plain',
} as const;

export const EMAIL_ATTACHMENT_TYPES = {
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
  PDF: 'application/pdf',
  TEXT: 'text/plain',
} as const;

export const EMAIL_ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  STAGING: 'staging',
} as const;

export const getEmailEnvironment = (): string => {
  return process.env.NODE_ENV || EMAIL_ENVIRONMENTS.DEVELOPMENT;
};

export const isDevelopment = (): boolean => {
  return getEmailEnvironment() === EMAIL_ENVIRONMENTS.DEVELOPMENT;
};

export const isProduction = (): boolean => {
  return getEmailEnvironment() === EMAIL_ENVIRONMENTS.PRODUCTION;
};

export const EMAIL_RATE_LIMITS = {
  PER_DAY: 1000,
  // Resend free tier limit
  PER_HOUR: 100,
  PER_SECOND: 14,
} as const;

export const EMAIL_RETRY_CONFIG = {
  // 10 seconds
  BACKOFF_FACTOR: 2,

  INITIAL_DELAY: 1000,

  MAX_ATTEMPTS: 3,
  // 1 second
  MAX_DELAY: 10000,
} as const;

export type EmailTemplate = (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];
export type EmailStatus = (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];
export type EmailError = (typeof EMAIL_ERRORS)[keyof typeof EMAIL_ERRORS];
export type EmailContentType = (typeof EMAIL_CONTENT_TYPES)[keyof typeof EMAIL_CONTENT_TYPES];
export type EmailAttachmentType =
  (typeof EMAIL_ATTACHMENT_TYPES)[keyof typeof EMAIL_ATTACHMENT_TYPES];
export type EmailEnvironment = (typeof EMAIL_ENVIRONMENTS)[keyof typeof EMAIL_ENVIRONMENTS];
