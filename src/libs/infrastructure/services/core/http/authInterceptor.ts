/**
 * Authentication Interceptor for HTTP Requests
 *
 * Automatically handles:
 * - Adding Authorization headers to requests
 * - Intercepting 401 responses
 * - Automatic token cleanup and redirects
 * - Error handling for authentication failures
 */

interface RequestConfig {
  headers?: Record<string, string>;
  [key: string]: any;
}

interface AuthInterceptorConfig {
  onTokenExpired?: () => void;
  onUnauthorized?: () => void;
  excludeRoutes?: string[];
}

export class AuthInterceptor {
  private static instance: AuthInterceptor;
  private config: AuthInterceptorConfig = {};

  private constructor() {}

  static getInstance(): AuthInterceptor {
    if (!AuthInterceptor.instance) {
      AuthInterceptor.instance = new AuthInterceptor();
    }
    return AuthInterceptor.instance;
  }

  /**
   * Configure the interceptor with callbacks and options
   */
  configure(config: AuthInterceptorConfig) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Intercept and enhance fetch requests with authentication
   */
  async interceptRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // Get the current auth token
    const authToken = this.getAuthToken();

    // Add authorization header if token exists and route is not excluded
    if (authToken && !this.isExcludedRoute(url)) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }

    try {
      // Make the actual request
      const response = await fetch(url, options);

      // Handle authentication errors
      if (response.status === 401) {
        console.warn('Unauthorized request detected, handling token cleanup');

        const responseData = await response
          .clone()
          .json()
          .catch(() => ({}));

        // Check if it's a token expiration specifically
        const isTokenExpired =
          responseData?.code === 'TokenExpiredError' ||
          responseData?.message?.includes('Token expirado');

        // Clear invalid token
        this.clearAuthToken();

        // Call appropriate callback
        if (isTokenExpired && this.config.onTokenExpired) {
          this.config.onTokenExpired();
        } else if (this.config.onUnauthorized) {
          this.config.onUnauthorized();
        }

        // Default behavior: redirect to login
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}${isTokenExpired ? '&error=session_expired' : ''}`;

          // Avoid infinite redirects
          if (!window.location.pathname.startsWith('/auth/')) {
            window.location.href = loginUrl;
          }
        }
      }

      return response;
    } catch (error) {
      console.error('Request interceptor error:', error);
      throw error;
    }
  }

  /**
   * Enhanced fetch function with automatic auth handling
   */
  async authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    return this.interceptRequest(url, options);
  }

  /**
   * Get auth token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('auth_token');
  }

  /**
   * Clear auth token from localStorage
   */
  private clearAuthToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    // Also clear any cookies if they exist
    document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  /**
   * Check if a route should be excluded from auth headers
   */
  private isExcludedRoute(url: string): boolean {
    const excludedRoutes = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/contact',
      '/api/health',
      ...(this.config.excludeRoutes || []),
    ];

    return excludedRoutes.some((route) => url.includes(route));
  }

  /**
   * Setup automatic retry for failed requests
   */
  async authFetchWithRetry(
    url: string,
    options: RequestInit = {},
    maxRetries: number = 1
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await this.authFetch(url, options);

        // If successful or it's the final attempt, return the response
        if (response.ok || i === maxRetries) {
          return response;
        }

        // If it's a 401 and we have retries left, wait a bit and try again
        if (response.status === 401 && i < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          continue;
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        if (i === maxRetries) {
          throw lastError;
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }
}

// Export singleton instance
export const authInterceptor = AuthInterceptor.getInstance();

// Export enhanced fetch function for easy use
export const authFetch = (url: string, options?: RequestInit) =>
  authInterceptor.authFetch(url, options);

export const authFetchWithRetry = (url: string, options?: RequestInit, maxRetries?: number) =>
  authInterceptor.authFetchWithRetry(url, options, maxRetries);
