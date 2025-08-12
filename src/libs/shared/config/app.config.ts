/**
 * Application Configuration - Infrastructure Layer
 * Centralized application configuration management
 */

export interface AppConfig {
  app: {
    name: string;
    version: string;
    env: 'development' | 'staging' | 'production';
    port: number;
    baseUrl: string;
    corsOrigins: string[];
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshTokenSecret: string;
    refreshTokenExpiresIn: string;
    bcryptSaltRounds: number;
  };
  database: {
    url: string;
    maxConnections: number;
    connectionTimeout: number;
    enableLogging: boolean;
  };
  stripe: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
    apiVersion: string;
  };
  google: {
    mapsApiKey: string;
    placesApiKey: string;
  };
  email: {
    provider: 'resend' | 'sendgrid';
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  redis?: {
    url: string;
    maxRetries: number;
  };
  monitoring: {
    enableLogging: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    enableMetrics: boolean;
  };
}

export class AppConfigService {
  private static instance: AppConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  public static getInstance(): AppConfigService {
    if (!AppConfigService.instance) {
      AppConfigService.instance = new AppConfigService();
    }
    return AppConfigService.instance;
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public getAppConfig() {
    return this.config.app;
  }

  public getAuthConfig() {
    return this.config.auth;
  }

  public getDatabaseConfig() {
    return this.config.database;
  }

  public getStripeConfig() {
    return this.config.stripe;
  }

  public getGoogleConfig() {
    return this.config.google;
  }

  public getEmailConfig() {
    return this.config.email;
  }

  public getCloudinaryConfig() {
    return this.config.cloudinary;
  }

  public getRedisConfig() {
    return this.config.redis;
  }

  public getMonitoringConfig() {
    return this.config.monitoring;
  }

  public isProduction(): boolean {
    return this.config.app.env === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.app.env === 'development';
  }

  public isStaging(): boolean {
    return this.config.app.env === 'staging';
  }

  private loadConfig(): AppConfig {
    return {
      app: {
        name: process.env.APP_NAME || 'ReservApp',
        version: process.env.APP_VERSION || '1.0.0',
        env: (process.env.NODE_ENV as any) || 'development',
        port: parseInt(process.env.PORT || '3000', 10),
        baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
      },
      auth: {
        jwtSecret: process.env.JWT_SECRET || 'default-secret',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret',
        refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
      },
      database: {
        url: process.env.DATABASE_URL || '',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000', 10),
        enableLogging: process.env.DB_ENABLE_LOGGING === 'true',
      },
      stripe: {
        publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
        apiVersion: process.env.STRIPE_API_VERSION || '2023-10-16',
      },
      google: {
        mapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        placesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
      },
      email: {
        provider: (process.env.EMAIL_PROVIDER as any) || 'resend',
        apiKey: process.env.EMAIL_API_KEY || '',
        fromEmail: process.env.EMAIL_FROM || 'noreply@reservapp.com',
        fromName: process.env.EMAIL_FROM_NAME || 'ReservApp',
      },
      cloudinary: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
      },
      redis: process.env.REDIS_URL
        ? {
            url: process.env.REDIS_URL,
            maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
          }
        : undefined,
      monitoring: {
        enableLogging: process.env.ENABLE_LOGGING !== 'false',
        logLevel: (process.env.LOG_LEVEL as any) || 'info',
        enableMetrics: process.env.ENABLE_METRICS === 'true',
      },
    };
  }

  private validateConfig(): void {
    const requiredFields = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'EMAIL_API_KEY'];

    const missingFields = requiredFields.filter((field) => !process.env[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required environment variables: ${missingFields.join(', ')}`);
    }

    // Validate JWT secret strength in production
    if (this.isProduction() && this.config.auth.jwtSecret.length < 32) {
      throw new Error('JWT secret must be at least 32 characters long in production');
    }

    // Validate database URL format
    if (
      !this.config.database.url.startsWith('mysql://') &&
      !this.config.database.url.startsWith('postgresql://')
    ) {
      throw new Error('Invalid database URL format');
    }

    // Validate port range
    if (this.config.app.port < 1 || this.config.app.port > 65535) {
      throw new Error('Port must be between 1 and 65535');
    }
  }

  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.validateConfig();
  }

  public getConfigForEnvironment(env: string): Partial<AppConfig> {
    const baseConfig = {
      app: {
        ...this.config.app,
        env: env as any,
      },
    };

    switch (env) {
      case 'production':
        return {
          ...baseConfig,
          monitoring: {
            ...this.config.monitoring,
            enableLogging: true,
            logLevel: 'error',
            enableMetrics: true,
          },
        };
      case 'staging':
        return {
          ...baseConfig,
          monitoring: {
            ...this.config.monitoring,
            enableLogging: true,
            logLevel: 'warn',
            enableMetrics: true,
          },
        };
      case 'development':
      default:
        return {
          ...baseConfig,
          monitoring: {
            ...this.config.monitoring,
            enableLogging: true,
            logLevel: 'debug',
            enableMetrics: false,
          },
        };
    }
  }
}
