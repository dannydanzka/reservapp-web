/**
 * API Response Utilities
 * Standardized response helpers
 */

import { NextResponse } from 'next/server';

import { ApiError, ApiResponse, HttpStatus } from '../types/api.types';

export class ApiResponseBuilder {
  static success<T>(data: T, message?: string, status: HttpStatus = HttpStatus.OK): NextResponse {
    const response: ApiResponse<T> = {
      data,
      message,
      success: true,
    };

    return NextResponse.json(response, { status });
  }

  static error(
    error: string | ApiError,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
  ): NextResponse {
    const response: ApiResponse = {
      error: typeof error === 'string' ? error : error.message,
      success: false,
    };

    return NextResponse.json(response, { status });
  }

  static validationError(details: any): NextResponse {
    const response: ApiResponse = {
      data: details,
      error: 'Validation failed',
      success: false,
    };

    return NextResponse.json(response, { status: HttpStatus.UNPROCESSABLE_ENTITY });
  }

  static notFound(resource: string = 'Resource'): NextResponse {
    const response: ApiResponse = {
      error: `${resource} not found`,
      success: false,
    };

    return NextResponse.json(response, { status: HttpStatus.NOT_FOUND });
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse {
    const response: ApiResponse = {
      error: message,
      success: false,
    };

    return NextResponse.json(response, { status: HttpStatus.UNAUTHORIZED });
  }

  static forbidden(message: string = 'Forbidden'): NextResponse {
    const response: ApiResponse = {
      error: message,
      success: false,
    };

    return NextResponse.json(response, { status: HttpStatus.FORBIDDEN });
  }
}
