/**
 * HTTP service constants
 */

export const DEFAULT_ERROR_MESSAGE = 'Ha ocurrido un error inesperado. Por favor intenta de nuevo.';

export const DEFAULT_TIMEOUT = 30000; // 30 seconds

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: DEFAULT_TIMEOUT,
};
