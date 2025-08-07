/**
 * Standard API response structure for consistent communication
 * between web frontend, mobile app, and backend services.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
  meta?: ApiMeta;
}

/**
 * Metadata for API responses, useful for pagination and additional info.
 */
export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
}

/**
 * Standard error codes used across the application.
 */
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * HTTP status codes commonly used in the API.
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * User subscription status for the free/premium model.
 */
export enum SubscriptionStatus {
  FREE = 'free',
  PREMIUM = 'premium',
  TRIAL = 'trial',
}

/**
 * Business plan types with traffic limits and pricing.
 */
export enum BusinessPlan {
  INICIAL = 'inicial',
  PROFESIONAL = 'profesional',
  ENTERPRISE = 'enterprise',
}

/**
 * Business plan configuration with traffic limits and pricing.
 */
export interface BusinessPlanConfig {
  name: string;
  monthlyPrice: number;
  monthlyVisitLimit: number;
  commissionRate: number; // Percentage
  serviceLimit?: number; // Maximum number of services allowed
  extraVisitPolicy: string; // Policy for extra visits (e.g., "precio preferencial")
  features: string[];
}

/**
 * Subscription and plan configuration.
 */
export const BUSINESS_PLANS: Record<BusinessPlan, BusinessPlanConfig> = {
  [BusinessPlan.INICIAL]: {
    commissionRate: 5,
    extraVisitPolicy: 'Tráfico adicional a precio preferencial',
    features: [
      'Hasta 5 servicios',
      '5% comisión por venta realizada',
      'Hasta 5,000 visitas mensuales',
      'Panel administrativo',
      'Soporte estándar',
      'Tráfico adicional a precio preferencial',
    ],
    monthlyPrice: 1299,
    monthlyVisitLimit: 5000,
    name: 'Plan Inicial',
    serviceLimit: 5,
  },
  [BusinessPlan.PROFESIONAL]: {
    commissionRate: 4,
    extraVisitPolicy: 'Tráfico adicional a precio preferencial',
    features: [
      'Servicios ilimitados',
      '4% comisión por venta realizada',
      'Hasta 25,000 visitas mensuales',
      'Reportes detallados',
      'Soporte prioritario',
      'Tráfico adicional a precio preferencial',
    ],
    monthlyPrice: 2499,
    monthlyVisitLimit: 25000,
    name: 'Plan Profesional',
  },
  [BusinessPlan.ENTERPRISE]: {
    commissionRate: 3,
    extraVisitPolicy: 'Tráfico adicional a precio preferencial',
    features: [
      'Todo lo anterior',
      '3% comisión por venta realizada',
      'Hasta 100,000 visitas mensuales',
      'Múltiples ubicaciones',
      'Soporte 24/7',
      'Tráfico adicional a precio preferencial',
    ],
    monthlyPrice: 4999,
    monthlyVisitLimit: 100000,
    name: 'Plan Enterprise',
  },
};
