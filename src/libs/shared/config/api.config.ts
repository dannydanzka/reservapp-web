/**
 * API Configuration
 * Central configuration for API layer
 */

export const API_CONFIG = {
  version: 'v1',
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: '24h',
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  uploads: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  users: {
    list: '/users',
    detail: '/users/:id',
    create: '/users',
    update: '/users/:id',
    delete: '/users/:id',
  },
  venues: {
    list: '/venues',
    detail: '/venues/:id',
    search: '/venues/search',
    nearby: '/venues/nearby',
    popular: '/venues/popular',
  },
  reservations: {
    list: '/reservations',
    detail: '/reservations/:id',
    create: '/reservations',
    update: '/reservations/:id',
    cancel: '/reservations/:id/cancel',
  },
  payments: {
    list: '/payments',
    detail: '/payments/:id',
    create: '/payments',
    refund: '/payments/:id/refund',
    webhook: '/payments/webhook',
  },
};
