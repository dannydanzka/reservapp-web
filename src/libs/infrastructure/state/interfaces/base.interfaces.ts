/**
 * Base state interfaces for Redux slices.
 * Following Jafra's patterns for consistent state management.
 */

export interface BaseState {
  isLoading: boolean;
  isError?: boolean;
  error?: string | null;
  lastUpdated?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}
