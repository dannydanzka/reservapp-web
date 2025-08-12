import { cloneDeep, merge } from 'lodash';

interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  database: {
    url: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiration: string;
    bcryptRounds: number;
  };
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    currency: string;
  };
  email: {
    provider: string;
    fromEmail: string;
    fromName: string;
  };
  uploads: {
    provider: string;
    maxFileSize: number;
    allowedFormats: string[];
  };
  features: {
    enableEmails: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableReviews: boolean;
    enablePayments: boolean;
  };
  ui: {
    itemsPerPage: number;
    maxUploadSize: string;
    supportedLanguages: string[];
  };
  external: {
    googlePlacesApiKey: string;
    googleMapsApiKey: string;
  };
}

function loadConfig(configName: string): Partial<AppConfig> {
  try {
    if (typeof window === 'undefined' && typeof require !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(`./environments/${configName}.json`);
    }

    // For client-side, return empty config (will be provided by server)
    if (typeof window !== 'undefined') {
      return {};
    }

    return {};
  } catch (error) {
    console.warn(`Could not load config ${configName}:`, error);
    return {};
  }
}

/**
 * Gets configuration for specific environment
 */
export function getConfig(environment?: string): AppConfig {
  const env = environment || process.env.NODE_ENV || 'development';

  const defaultConfig = loadConfig('default');
  const copyOfDefaultConfig = cloneDeep(defaultConfig);
  let configResult: Partial<AppConfig> = {};

  switch (env) {
    case 'development':
    case 'dev':
      configResult = merge(copyOfDefaultConfig, loadConfig('development'));
      break;
    case 'production':
    case 'prod':
      configResult = merge(copyOfDefaultConfig, loadConfig('production'));
      break;
    case 'qa':
    case 'test':
      configResult = merge(copyOfDefaultConfig, loadConfig('qa'));
      break;
    default:
      configResult = merge(copyOfDefaultConfig, loadConfig('development'));
      break;
  }

  // Override with environment variables if available
  const envOverrides: Partial<AppConfig> = {
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || configResult.api?.baseUrl,
      retries: parseInt(process.env.API_RETRIES || '') || configResult.api?.retries,
      timeout: parseInt(process.env.API_TIMEOUT || '') || configResult.api?.timeout,
    },
    auth: {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '') || configResult.auth?.bcryptRounds,
      jwtExpiration: process.env.JWT_EXPIRATION || configResult.auth?.jwtExpiration,
      jwtSecret: process.env.JWT_SECRET || configResult.auth?.jwtSecret,
    },
    database: {
      url: process.env.DATABASE_URL || configResult.database?.url,
    },
    email: {
      fromEmail: process.env.EMAIL_FROM || configResult.email?.fromEmail,
      fromName: process.env.EMAIL_FROM_NAME || configResult.email?.fromName,
      provider: process.env.EMAIL_PROVIDER || configResult.email?.provider,
    },
    external: {
      googleMapsApiKey:
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || configResult.external?.googleMapsApiKey,
      googlePlacesApiKey:
        process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || configResult.external?.googlePlacesApiKey,
    },
    features: {
      enableAnalytics:
        process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' ||
        configResult.features?.enableAnalytics,
      enableEmails:
        process.env.NEXT_PUBLIC_ENABLE_EMAILS === 'true' || configResult.features?.enableEmails,
      enableNotifications:
        process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true' ||
        configResult.features?.enableNotifications,
      enablePayments:
        process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true' || configResult.features?.enablePayments,
      enableReviews:
        process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true' || configResult.features?.enableReviews,
    },
    stripe: {
      currency: process.env.STRIPE_CURRENCY || configResult.stripe?.currency,
      publishableKey:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || configResult.stripe?.publishableKey,
      secretKey: process.env.STRIPE_SECRET_KEY || configResult.stripe?.secretKey,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || configResult.stripe?.webhookSecret,
    },
  };

  return merge(configResult, envOverrides) as AppConfig;
}

/**
 * Get current environment name
 */
export function getCurrentEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
  const config = getConfig();
  return config.features[feature] || false;
}

/**
 * Get API base URL for current environment
 */
export function getApiBaseUrl(): string {
  const config = getConfig();
  return config.api.baseUrl;
}

/**
 * Get Stripe publishable key for current environment
 */
export function getStripePublishableKey(): string {
  const config = getConfig();
  return config.stripe.publishableKey;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return getCurrentEnvironment() === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return getCurrentEnvironment() === 'production';
}

// Export default config instance
export const config = getConfig();
