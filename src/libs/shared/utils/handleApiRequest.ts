/**
 * Server-side API request handler utilities
 */

import { NextRequest, NextResponse } from 'next/server';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
  timestamp?: string;
}

// Client-side API request handler
export const handleApiRequest = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return {
        error: `HTTP ${response?.status}: ${response.statusText}`,
        success: false,
        timestamp: new Date().toISOString(),
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      timestamp: new Date().toISOString(),
    };
  }
};

export interface ApiRequestHandler<T = any> {
  (request: NextRequest): Promise<NextResponse<ApiResponse<T>>>;
}

/**
 * Wrapper for API route handlers with standardized error handling
 */
export const withErrorHandling = <T>(
  handler: (request: NextRequest) => Promise<ApiResponse<T>>
): ApiRequestHandler<T> => {
  return async (request: NextRequest): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      const response = await handler(request);

      const status = response.success ? 200 : 400;

      return NextResponse.json(response, {
        headers: {
          'Content-Type': 'application/json',
        },
        status,
      });
    } catch (error) {
      const errorResponse: ApiResponse<null> = {
        error: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Internal server error',
        success: false,
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(errorResponse, { status: 500 }) as NextResponse<ApiResponse<T>>;
    }
  };
};

/**
 * Validates request body against schema
 */
export const validateRequestBody = <T>(
  body: any,
  requiredFields: (keyof T)[]
): { isValid: boolean; errors?: string[] } => {
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!body[field]) {
      errors.push(`${String(field)} is required`);
    }
  }

  return {
    errors: errors.length > 0 ? errors : undefined,
    isValid: errors.length === 0,
  };
};
