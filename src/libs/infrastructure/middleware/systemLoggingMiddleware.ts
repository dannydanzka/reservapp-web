import { NextRequest, NextResponse } from 'next/server';

import { generateRequestId, getClientInfo } from '@libs/core/utils/requestUtils';
import { SystemLoggingService } from '@libs/services/systemLogging/systemLoggingService';

export interface LoggingConfig {
  enableApiRequestLogging: boolean;
  enableErrorLogging: boolean;
  enablePerformanceLogging: boolean;
  logSuccessfulRequests: boolean;
  excludeRoutes: string[];
  performanceThreshold: number; // milliseconds
}

const DEFAULT_CONFIG: LoggingConfig = {
  enableApiRequestLogging: true,
  enableErrorLogging: true,
  enablePerformanceLogging: true,
  excludeRoutes: ['/api/health', '/api/ping', '/_next', '/favicon.ico'],
  logSuccessfulRequests: process.env.NODE_ENV === 'development',
  performanceThreshold: 1000, // 1 second
};

/**
 * System logging middleware for automatic request/response logging
 */
export class SystemLoggingMiddleware {
  private static config: LoggingConfig = DEFAULT_CONFIG;

  /**
   * Configure the logging middleware
   */
  static configure(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if a route should be excluded from logging
   */
  private static shouldExcludeRoute(pathname: string): boolean {
    return this.config.excludeRoutes.some((route) => pathname.startsWith(route));
  }

  /**
   * Middleware function for Next.js API routes
   */
  static async logApiRequest(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const startTime = Date.now();
    const requestId = generateRequestId();
    const clientInfo = getClientInfo(request);
    const { pathname } = request.nextUrl;
    const { method } = request;

    // Skip logging for excluded routes
    if (!this.config.enableApiRequestLogging || this.shouldExcludeRoute(pathname)) {
      return handler(request);
    }

    // Add request ID to headers for tracking
    const headers = new Headers(request.headers);
    headers.set('X-Request-ID', requestId);
    const enhancedRequest = new NextRequest(request.url, {
      body: request.body,
      headers,
      method: request.method,
    });

    let response: NextResponse;
    let error: Error | null = null;

    try {
      // Execute the handler
      response = await handler(enhancedRequest);

      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId);
    } catch (err) {
      error = err instanceof Error ? err : new Error('Unknown error occurred');

      // Create error response
      response = NextResponse.json(
        {
          error: 'Internal server error',
          requestId,
          success: false,
        },
        { status: 500 }
      );

      response.headers.set('X-Request-ID', requestId);
    }

    const duration = Date.now() - startTime;
    const statusCode = response.status;

    // Log API request if enabled
    if (this.config.enableApiRequestLogging) {
      const shouldLog =
        error || // Always log errors
        statusCode >= 400 || // Always log client/server errors
        this.config.logSuccessfulRequests || // Log successful requests if enabled
        (this.config.enablePerformanceLogging && duration > this.config.performanceThreshold); // Log slow requests

      if (shouldLog) {
        try {
          await SystemLoggingService.logApiRequest({
            duration,
            errorMessage: error?.message,
            ipAddress: clientInfo.ipAddress,
            method,
            requestId,
            statusCode,
            url: pathname,
            userAgent: clientInfo.userAgent,
          });
        } catch (loggingError) {
          // Don't throw on logging errors to avoid breaking the request
          console.error('Failed to log API request:', loggingError);
        }
      }
    }

    // Log performance issues separately
    if (
      this.config.enablePerformanceLogging &&
      duration > this.config.performanceThreshold &&
      !error
    ) {
      try {
        await SystemLoggingService.logPerformanceMetric('slow_api_request', {
          metadata: {
            method,
            requestId,
            statusCode,
            url: pathname,
          },
          metricName: 'api_response_time',
          threshold: this.config.performanceThreshold,
          unit: 'ms',
          value: duration,
        });
      } catch (loggingError) {
        console.error('Failed to log performance metric:', loggingError);
      }
    }

    // Re-throw error if it occurred
    if (error) {
      throw error;
    }

    return response;
  }

  /**
   * Wrapper function for API route handlers
   */
  static withLogging(
    handler: (req: NextRequest) => Promise<NextResponse>
  ): (req: NextRequest) => Promise<NextResponse> {
    return async (request: NextRequest) => {
      return this.logApiRequest(request, handler);
    };
  }

  /**
   * Log authentication events
   */
  static async logAuthenticationEvent(
    eventType: string,
    data: {
      userId?: string;
      userEmail?: string;
      userName?: string;
      success: boolean;
      ipAddress?: string;
      userAgent?: string;
      errorMessage?: string;
      metadata?: any;
    }
  ): Promise<void> {
    try {
      await SystemLoggingService.logAuthentication(eventType, data);
    } catch (error) {
      console.error('Failed to log authentication event:', error);
    }
  }

  /**
   * Log security events
   */
  static async logSecurityEvent(
    eventType: string,
    data: {
      userId?: string;
      userEmail?: string;
      ipAddress?: string;
      userAgent?: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      metadata?: any;
    }
  ): Promise<void> {
    try {
      await SystemLoggingService.logSecurityEvent(eventType, data);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Log payment events
   */
  static async logPaymentEvent(
    eventType: string,
    data: {
      userId?: string;
      paymentId: string;
      amount?: number;
      currency?: string;
      status?: string;
      success: boolean;
      errorMessage?: string;
      duration?: number;
      metadata?: any;
    }
  ): Promise<void> {
    try {
      await SystemLoggingService.logPaymentEvent(eventType, data);
    } catch (error) {
      console.error('Failed to log payment event:', error);
    }
  }

  /**
   * Log email events
   */
  static async logEmailEvent(
    eventType: string,
    data: {
      recipientEmail: string;
      subject: string;
      templateType: string;
      success: boolean;
      errorMessage?: string;
      duration?: number;
      metadata?: any;
    }
  ): Promise<void> {
    try {
      await SystemLoggingService.logEmailEvent(eventType, data);
    } catch (error) {
      console.error('Failed to log email event:', error);
    }
  }

  /**
   * Log database operations
   */
  static async logDatabaseOperation(
    eventType: string,
    data: {
      operation: 'create' | 'update' | 'delete';
      tableName: string;
      recordId: string;
      userId?: string;
      oldValues?: any;
      newValues?: any;
      duration?: number;
    }
  ): Promise<void> {
    try {
      await SystemLoggingService.logDatabaseOperation(eventType, data);
    } catch (error) {
      console.error('Failed to log database operation:', error);
    }
  }

  /**
   * Get current configuration
   */
  static getConfig(): LoggingConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable logging types at runtime
   */
  static setLoggingEnabled(type: keyof LoggingConfig, enabled: boolean): void {
    if (typeof this.config[type] === 'boolean') {
      (this.config as any)[type] = enabled;
    }
  }
}
