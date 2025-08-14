export type { ApiResponse, ApiMeta, ApiError } from '@libs/shared/types/api.types';

/**
 * Paginated response structure for API endpoints that return lists
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
