/**
 * Database Configuration - Infrastructure Layer
 * Centralized database configuration and connection management
 */

export interface DatabaseConfig {
  url: string;
  maxConnections: number;
  connectionTimeout: number;
  idleTimeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
  logLevel: 'query' | 'error' | 'info' | 'warn';
}

export interface TransactionConfig {
  maxWait: number;
  timeout: number;
  isolationLevel: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
}

export class DatabaseConfigService {
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  getDatabaseUrl(): string {
    return this.config.url;
  }

  getConnectionConfig() {
    return {
      connectionLimit: this.config.maxConnections,
      acquireTimeout: this.config.connectionTimeout,
      timeout: this.config.idleTimeout,
    };
  }

  getRetryConfig() {
    return {
      retries: this.config.retryAttempts,
      retryDelay: this.config.retryDelay,
    };
  }

  getLoggingConfig() {
    return {
      log: this.config.enableLogging ? [this.config.logLevel] : [],
    };
  }

  getDefaultTransactionConfig(): TransactionConfig {
    return {
      maxWait: 5000,
      timeout: 10000,
      isolationLevel: 'ReadCommitted',
    };
  }

  validateConfig(): void {
    if (!this.config.url) {
      throw new Error('Database URL is required');
    }

    if (this.config.maxConnections <= 0) {
      throw new Error('Max connections must be greater than 0');
    }

    if (this.config.connectionTimeout <= 0) {
      throw new Error('Connection timeout must be greater than 0');
    }

    if (this.config.retryAttempts < 0) {
      throw new Error('Retry attempts must be non-negative');
    }
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  static createFromEnvironment(): DatabaseConfig {
    return {
      url: process.env.DATABASE_URL || '',
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000', 10),
      idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
      retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '3', 10),
      retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000', 10),
      enableLogging: process.env.DB_ENABLE_LOGGING === 'true',
      logLevel: (process.env.DB_LOG_LEVEL as any) || 'error',
    };
  }
}
