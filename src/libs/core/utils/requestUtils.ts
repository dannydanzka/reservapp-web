import { NextRequest } from 'next/server';

export interface ClientInfo {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Extract client information from request headers
 */
export function getClientInfo(request: NextRequest): ClientInfo {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const userAgent = request.headers.get('user-agent');

  let ipAddress: string | undefined;

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    ipAddress = forwarded.split(',')[0].trim();
  } else if (realIp) {
    ipAddress = realIp;
  } else {
    // Fallback to connection remote address (may not be available in all environments)
    ipAddress = undefined;
  }

  return {
    ipAddress,
    userAgent: userAgent || undefined,
  };
}

/**
 * Generate a unique request ID for tracking
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract pagination parameters from URL search params
 */
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const skip = (page - 1) * limit;

  return { limit, page, skip };
}

/**
 * Extract sorting parameters from URL search params
 */
export function getSortingParams(searchParams: URLSearchParams, allowedFields: string[] = []) {
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null;

  if (!sortBy || !allowedFields.includes(sortBy)) {
    return undefined;
  }

  return {
    [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc',
  };
}

/**
 * Extract date range parameters from URL search params
 */
export function getDateRangeParams(searchParams: URLSearchParams) {
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  return {
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
  };
}

/**
 * Validate required parameters
 */
export function validateRequiredParams(params: Record<string, any>, required: string[]): void {
  const missing = required.filter((field) => !params[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(', ')}`);
  }
}

/**
 * Sanitize search query for database queries
 */
export function sanitizeSearchQuery(query: string | null): string | undefined {
  if (!query) return undefined;

  // Remove potentially harmful characters and limit length
  return query
    .trim()
    .replace(/[<>\"'%;()&+]/g, '')
    .substring(0, 100);
}
