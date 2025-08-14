/**
 * Dashboard configuration constants
 * Centralized settings for dashboard refresh intervals and behaviors
 */

// Dashboard refresh intervals (in milliseconds)
export const DASHBOARD_CONFIG = {
  // Auto-refresh enabled by default
  AUTO_REFRESH_ENABLED: process.env.NEXT_PUBLIC_AUTO_REFRESH_ENABLED !== 'false',
  // Chart refresh interval - default 10 minutes
  CHARTS_REFRESH_INTERVAL: parseInt(
    process.env.NEXT_PUBLIC_CHARTS_REFRESH_INTERVAL || '600000',
    10
  ),

  // Development mode - shorter intervals for testing
  DEV_MODE: process.env.NODE_ENV === 'development',

  // System logs refresh interval - default 10 minutes
  LOGS_REFRESH_INTERVAL: parseInt(process.env.NEXT_PUBLIC_LOGS_REFRESH_INTERVAL || '600000', 10),

  // Real-time features refresh interval - default 10 minutes
  REALTIME_REFRESH_INTERVAL: parseInt(
    process.env.NEXT_PUBLIC_REALTIME_REFRESH_INTERVAL || '600000',
    10
  ),

  // Stats refresh interval - default 10 minutes
  STATS_REFRESH_INTERVAL: parseInt(process.env.NEXT_PUBLIC_STATS_REFRESH_INTERVAL || '600000', 10),
} as const;

// Helper functions for readable time formats
export const DASHBOARD_INTERVALS = {
  FIFTEEN_MINUTES: 900000,

  FIFTEEN_SECONDS: 15000,

  FIVE_MINUTES: 300000,
  // Common intervals in milliseconds
  NEVER: 0,
  ONE_HOUR: 3600000,
  ONE_MINUTE: 60000,
  TEN_MINUTES: 600000,
  THIRTY_MINUTES: 1800000,
  THIRTY_SECONDS: 30000,
  TWO_MINUTES: 120000,
} as const;

// Get adjusted interval for development
export const getRefreshInterval = (interval: number): number => {
  if (DASHBOARD_CONFIG.DEV_MODE) {
    // In development, use shorter intervals for testing
    return Math.max(interval / 2, DASHBOARD_INTERVALS.FIFTEEN_SECONDS);
  }
  return interval;
};

// Get human-readable interval description
export const getIntervalDescription = (ms: number): string => {
  if (ms === 0) return 'Nunca';
  if (ms < 60000) return `${ms / 1000}s`;
  if (ms < 3600000) return `${ms / 60000}m`;
  return `${ms / 3600000}h`;
};
