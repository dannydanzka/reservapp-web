/**
 * Global Error Handler Utility
 *
 * Provides centralized error handling for authentication and API errors
 */

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  isAuthError?: boolean;
  shouldRedirect?: boolean;
  redirectUrl?: string;
}

export class ErrorHandler {
  /**
   * Parse and categorize different types of errors
   */
  static parseError(error: any): AppError {
    // Network or fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 0,
      };
    }

    // Authentication errors
    if (error.message?.includes('Token expirado') || error.code === 'TokenExpiredError') {
      return {
        code: 'TOKEN_EXPIRED',
        isAuthError: true,
        message: 'Tu sesión ha expirado. Serás redirigido al login.',
        redirectUrl: '/auth/login?error=session_expired',
        shouldRedirect: true,
        status: 401,
      };
    }

    if (error.message?.includes('Token inválido') || error.code === 'JsonWebTokenError') {
      return {
        code: 'INVALID_TOKEN',
        isAuthError: true,
        message: 'Tu sesión es inválida. Por favor inicia sesión nuevamente.',
        redirectUrl: '/auth/login?error=invalid_token',
        shouldRedirect: true,
        status: 401,
      };
    }

    // Server errors
    if (error.status >= 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'Error del servidor. Inténtalo de nuevo más tarde.',
        status: error.status,
      };
    }

    // Permission errors
    if (error.status === 403) {
      return {
        code: 'FORBIDDEN',
        message: 'No tienes permisos para realizar esta acción.',
        status: 403,
      };
    }

    // Not found errors
    if (error.status === 404) {
      return {
        code: 'NOT_FOUND',
        message: 'El recurso solicitado no fue encontrado.',
        status: 404,
      };
    }

    // Default error handling
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'Ha ocurrido un error inesperado',
      status: error.status || 500,
    };
  }

  /**
   * Handle authentication-specific errors
   */
  static handleAuthError(error: AppError): void {
    if (!error.isAuthError) {
      return;
    }

    // Clear any existing auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');

      // Clear auth cookies
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // Show user-friendly message
    console.error('Authentication error:', error.message);

    // Redirect if needed
    if (error.shouldRedirect && error.redirectUrl && typeof window !== 'undefined') {
      // Add current path as redirect parameter if not already present
      const currentPath = window.location.pathname;
      const url = new URL(error.redirectUrl, window.location.origin);

      if (!url.searchParams.has('redirect') && currentPath !== '/') {
        url.searchParams.set('redirect', currentPath);
      }

      // Delay slightly to allow any state updates to complete
      setTimeout(() => {
        window.location.href = url.toString();
      }, 100);
    }
  }

  /**
   * Handle API response errors
   */
  static async handleApiResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      const error: AppError = {
        code: errorData.code,
        isAuthError: response.status === 401,
        message: errorData.message || `HTTP Error ${response.status}`,
        status: response.status,
      };

      // Handle auth errors automatically
      if (error.isAuthError) {
        this.handleAuthError(this.parseError(error));
      }

      throw error;
    }

    return response.json();
  }

  /**
   * Create a standardized error for consistent handling
   */
  static createError(message: string, code?: string, status?: number): AppError {
    return {
      code: code || 'APP_ERROR',
      message,
      status: status || 500,
    };
  }

  /**
   * Log errors with context
   */
  static logError(error: AppError, context?: string): void {
    const logLevel = error.status >= 500 ? 'error' : 'warn';
    const prefix = context ? `[${context}]` : '[ErrorHandler]';

    console[logLevel](`${prefix} ${error.code || 'ERROR'}:`, error.message, {
      code: error.code,
      isAuthError: error.isAuthError,
      status: error.status,
    });
  }
}

// Export convenience functions
export const { parseError } = ErrorHandler;
export const { handleAuthError } = ErrorHandler;
export const { handleApiResponse } = ErrorHandler;
export const { createError } = ErrorHandler;
export const { logError } = ErrorHandler;
