/**
 * Review Management Hook - Presentation Layer
 * Handles review operations and state management
 */

import { useCallback, useEffect, useState } from 'react';

import { authFetch } from '@libs/infrastructure/services/core/http/authInterceptor';

import { Review } from '../../../domain/review/entities/Review';

// Define ReviewStatus locally as it's not exported
type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewFilters {
  status?: ReviewStatus;
  rating?: number;
  minRating?: number;
  maxRating?: number;
  venueId?: string;
  serviceId?: string;
  userId?: string;
  businessId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasResponse?: boolean;
}

export interface ReviewStats {
  totalReviews: number;
  activeReviews: number;
  pendingReviews: number;
  flaggedReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  responseRate: number;
}

export interface UseReviewManagementReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  stats: ReviewStats | null;
  filters: ReviewFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Actions
  fetchReviews: (filters?: ReviewFilters) => Promise<void>;
  fetchReviewById: (id: string) => Promise<Review | null>;
  updateReviewStatus: (id: string, status: ReviewStatus) => Promise<boolean>;
  flagReview: (id: string, reason: string) => Promise<boolean>;
  approveReview: (id: string) => Promise<boolean>;
  rejectReview: (id: string, reason?: string) => Promise<boolean>;
  respondToReview: (id: string, response: string) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;

  // Bulk actions
  bulkUpdateStatus: (reviewIds: string[], status: ReviewStatus) => Promise<boolean>;
  bulkApprove: (reviewIds: string[]) => Promise<boolean>;
  bulkReject: (reviewIds: string[]) => Promise<boolean>;

  // Analytics
  getReviewAnalytics: (venueId?: string, serviceId?: string) => Promise<void>;
  exportReviews: (format: 'csv' | 'excel', filters?: ReviewFilters) => Promise<void>;

  // Filters & Pagination
  setFilters: (filters: ReviewFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;
}

export const useReviewManagement = (): UseReviewManagementReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [pagination, setPagination] = useState({
    hasNext: false,
    hasPrev: false,
    limit: 20,
    page: 1,
    total: 0,
  });

  const fetchReviews = useCallback(
    async (newFilters?: ReviewFilters) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.page.toString());
        queryParams.append('limit', pagination.limit.toString());

        const activeFilters = newFilters || filters;

        if (activeFilters?.status) {
          queryParams.append('status', activeFilters?.status);
        }

        if (activeFilters.rating) {
          queryParams.append('rating', activeFilters.rating.toString());
        }

        if (activeFilters.minRating) {
          queryParams.append('minRating', activeFilters.minRating.toString());
        }

        if (activeFilters.maxRating) {
          queryParams.append('maxRating', activeFilters.maxRating.toString());
        }

        if (activeFilters.venueId) {
          queryParams.append('venueId', activeFilters.venueId);
        }

        if (activeFilters.serviceId) {
          queryParams.append('serviceId', activeFilters.serviceId);
        }

        if (activeFilters.userId) {
          queryParams.append('userId', activeFilters.userId);
        }

        if (activeFilters.businessId) {
          queryParams.append('businessId', activeFilters.businessId);
        }

        if (activeFilters.dateFrom) {
          queryParams.append('dateFrom', activeFilters.dateFrom.toISOString());
        }

        if (activeFilters.dateTo) {
          queryParams.append('dateTo', activeFilters.dateTo.toISOString());
        }

        if (activeFilters.hasResponse !== undefined) {
          queryParams.append('hasResponse', activeFilters.hasResponse.toString());
        }

        const response = await authFetch(`/api/admin/reviews?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();

        setReviews(data.reviews);
        setPagination(data.pagination);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  const fetchReviewById = useCallback(async (id: string): Promise<Review | null> => {
    try {
      setError(null);

      const response = await authFetch(`/api/admin/reviews/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch review');
      }

      const data = await response.json();
      return data.review;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch review');
      return null;
    }
  }, []);

  const updateReviewStatus = useCallback(
    async (id: string, status: ReviewStatus): Promise<boolean> => {
      try {
        setError(null);

        const response = await authFetch(`/api/admin/reviews/${id}/status`, {
          body: JSON.stringify({ status }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update review status');
        }

        // Update local state
        setReviews((prevReviews) =>
          prevReviews.map((review) => (review.id === id ? { ...review, status } : review))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update review status');
        return false;
      }
    },
    []
  );

  const flagReview = useCallback(async (id: string, reason: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await authFetch(`/api/admin/reviews/${id}/flag`, {
        body: JSON.stringify({ reason }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to flag review');
      }

      // Update local state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, status: 'flagged' as any } : review
        )
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to flag review');
      return false;
    }
  }, []);

  const approveReview = useCallback(
    async (id: string): Promise<boolean> => {
      return updateReviewStatus(id, 'approved' as any);
    },
    [updateReviewStatus]
  );

  const rejectReview = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await authFetch(`/api/admin/reviews/${id}/reject`, {
        body: JSON.stringify({ reason }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reject review');
      }

      // Update local state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, status: 'rejected' as any } : review
        )
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject review');
      return false;
    }
  }, []);

  const respondToReview = useCallback(async (id: string, response: string): Promise<boolean> => {
    try {
      setError(null);

      const apiResponse = await authFetch(`/api/admin/reviews/${id}/response`, {
        body: JSON.stringify({ response }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to respond to review');
      }

      const data = await apiResponse.json();
      const updatedReview = data.review;

      // Update local state
      setReviews((prevReviews) =>
        prevReviews.map((review) => (review.id === id ? updatedReview : review))
      );

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to respond to review');
      return false;
    }
  }, []);

  const deleteReview = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await authFetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Remove from local state
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      return false;
    }
  }, []);

  const bulkUpdateStatus = useCallback(
    async (reviewIds: string[], status: ReviewStatus): Promise<boolean> => {
      try {
        setError(null);

        const response = await authFetch('/api/admin/reviews/bulk/status', {
          body: JSON.stringify({ reviewIds, status }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to bulk update review status');
        }

        // Update local state
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            reviewIds.includes(review.id) ? { ...review, status } : review
          )
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to bulk update review status');
        return false;
      }
    },
    []
  );

  const bulkApprove = useCallback(
    async (reviewIds: string[]): Promise<boolean> => {
      return bulkUpdateStatus(reviewIds, 'approved' as any);
    },
    [bulkUpdateStatus]
  );

  const bulkReject = useCallback(
    async (reviewIds: string[]): Promise<boolean> => {
      return bulkUpdateStatus(reviewIds, 'rejected' as any);
    },
    [bulkUpdateStatus]
  );

  const getReviewAnalytics = useCallback(async (venueId?: string, serviceId?: string) => {
    try {
      setError(null);

      const queryParams = new URLSearchParams();
      if (venueId) queryParams.append('venueId', venueId);
      if (serviceId) queryParams.append('serviceId', serviceId);

      const response = await authFetch(`/api/admin/reviews/analytics?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch review analytics');
      }

      const data = await response.json();
      setStats(data.analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch review analytics');
    }
  }, []);

  const exportReviews = useCallback(
    async (format: 'csv' | 'excel', exportFilters?: ReviewFilters) => {
      try {
        setError(null);

        const queryParams = new URLSearchParams();
        queryParams.append('format', format);

        const activeFilters = exportFilters || filters;

        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (value instanceof Date) {
              queryParams.append(key, value.toISOString());
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        const response = await authFetch(`/api/admin/reviews/export?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to export reviews');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reviews-export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to export reviews');
      }
    },
    [filters]
  );

  const handleSetFilters = useCallback((newFilters: ReviewFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSetPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handleSetLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Load reviews on mount and when filters/pagination change
  useEffect(() => {
    fetchReviews();
  }, [filters, pagination.page, pagination.limit]);

  return {
    approveReview,
    bulkApprove,
    bulkReject,
    bulkUpdateStatus,
    clearFilters,
    deleteReview,
    error,
    exportReviews,
    fetchReviewById,
    fetchReviews,
    filters,
    flagReview,
    getReviewAnalytics,
    loading,
    pagination,
    rejectReview,
    respondToReview,
    reviews,
    setFilters: handleSetFilters,
    setLimit: handleSetLimit,
    setPage: handleSetPage,
    stats,
    updateReviewStatus,
  };
};
