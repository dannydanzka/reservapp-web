/**
 * Server-side API request handler utilities
 */

import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse } from '@/libs/types/api.types';

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
