export const APP_CONFIG = {
  AUTHOR: 'Roberto Ramirez',
  CONTACT_EMAIL: 'info@reservapp.com',
  DESCRIPTION: 'Modern reservation management system',
  NAME: 'ReservApp',
  SUPPORT_EMAIL: 'support@reservapp.com',
  VERSION: '1.0.0',
} as const;

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  STAGING: 'staging',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  LANGUAGE: 'language',
  LAST_ROUTE: 'last_route',
  PREFERENCES: 'user_preferences',
  REFRESH_TOKEN: 'refresh_token',
  SEARCH_HISTORY: 'search_history',
  THEME: 'theme',
  USER_PROFILE: 'user_profile',
} as const;

export const ROUTES = {
  // Admin
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin',
    PAYMENTS: '/admin/payments',
    REPORTS: '/admin/reports',
    RESERVATIONS: '/admin/reservations',
    SERVICES: '/admin/services',
    SETTINGS: '/admin/settings',
    USERS: '/admin/users',
    VENUES: '/admin/venues',
  },

  // Authentication
  AUTH: {
    BASE: '/auth',
    FORGOT_PASSWORD: '/auth/forgot-password',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
  },

  HOME: '/',

  LANDING: '/landing',

  // Public
  PUBLIC: {
    ABOUT: '/about',
    BOOKING: '/booking',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    VENUES: '/venues',
    VENUE_DETAIL: (id: string) => `/venues/${id}`,
  },

  // User
  USER: {
    BASE: '/user',
    DASHBOARD: '/user',
    FAVORITES: '/user/favorites',
    PROFILE: '/user/profile',
    RESERVATIONS: '/user/reservations',
  },
} as const;

export const PERMISSIONS = {
  // Admin permissions
  ADMIN: {
    FULL_ACCESS: 'admin:full_access',
    MANAGE_INTEGRATIONS: 'admin:manage_integrations',
    MANAGE_USERS: 'admin:manage_users',
    MANAGE_VENUES: 'admin:manage_venues',
    SYSTEM_SETTINGS: 'admin:system_settings',
    VIEW_LOGS: 'admin:view_logs',
  },

  // Employee permissions
  EMPLOYEE: {
    CHECK_IN: 'employee:check_in',
    CHECK_OUT: 'employee:check_out',
    MANAGE_RESERVATIONS: 'employee:manage_reservations',
    VIEW_DASHBOARD: 'employee:view_dashboard',
    VIEW_GUESTS: 'employee:view_guests',
    VIEW_RESERVATIONS: 'employee:view_reservations',
  },

  // Manager permissions
  MANAGER: {
    EXPORT_DATA: 'manager:export_data',
    MANAGE_RATES: 'manager:manage_rates',
    MANAGE_SERVICES: 'manager:manage_services',
    MANAGE_STAFF: 'manager:manage_staff',
    VIEW_REPORTS: 'manager:view_reports',
    VIEW_REVENUE: 'manager:view_revenue',
  },

  // User permissions
  USER: {
    CANCEL_RESERVATION: 'user:cancel_reservation',
    CREATE_RESERVATION: 'user:create_reservation',
    EDIT_PROFILE: 'user:edit_profile',
    VIEW_PROFILE: 'user:view_profile',
    VIEW_RESERVATIONS: 'user:view_reservations',
  },
} as const;

export const UI_CONSTANTS = {
  ANIMATION_DURATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  BREAKPOINTS: {
    LG: 992,
    MD: 768,
    SM: 576,
    XL: 1200,
    XS: 320,
    XXL: 1400,
  },

  DEBOUNCE_DELAYS: {
    INPUT: 150,
    RESIZE: 100,
    SCROLL: 50,
    SEARCH: 300,
  },

  Z_INDEX: {
    DROPDOWN: 1000,
    FIXED: 1030,
    MODAL: 1050,
    MODAL_BACKDROP: 1040,
    POPOVER: 1060,
    STICKY: 1020,
    TOAST: 1080,
    TOOLTIP: 1070,
  },
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: 'yyyy-MM-dd HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  MONTH_YEAR: 'MMM yyyy',
  TIME_ONLY: 'HH:mm',
  WEEKDAY: 'EEEE',
} as const;

export const FILE_UPLOAD = {
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  IMAGE_DIMENSIONS: {
    LARGE: { height: 900, width: 1200 },
    MEDIUM: { height: 600, width: 800 },
    SMALL: { height: 300, width: 400 },
    THUMBNAIL: { height: 150, width: 150 },
  },
  // 5MB
  MAX_IMAGES_PER_SERVICE: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
} as const;

export const NOTIFICATION_TYPES = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
} as const;

export const NOTIFICATION_DURATION = {
  LONG: 7000,
  NORMAL: 5000,
  PERSISTENT: 0,
  SHORT: 3000, // Never auto-dismiss
} as const;
