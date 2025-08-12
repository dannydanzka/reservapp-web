/**
 * API configuration and endpoints
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  VERSION: 'v1',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
  },
  RESERVATIONS: {
    CREATE: '/reservations',
    DELETE: '/reservations/{id}',
    GET_ALL: '/reservations',
    GET_BY_ID: '/reservations/{id}',
    GET_BY_USER: '/reservations/user/{userId}',
    UPDATE: '/reservations/{id}',
  },
  USERS: {
    CREATE: '/users',
    DELETE: '/users/{id}',
    GET_ALL: '/users',
    GET_BY_ID: '/users/{id}',
    UPDATE: '/users/{id}',
  },
  VENUES: {
    CREATE: '/venues',
    DELETE: '/venues/{id}',
    GET_ALL: '/venues',
    GET_BY_ID: '/venues/{id}',
    UPDATE: '/venues/{id}',
  },
};
