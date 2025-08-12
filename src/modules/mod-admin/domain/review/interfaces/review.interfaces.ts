/**
 * Review Domain Interfaces
 * Clean Architecture - Domain Layer
 */

import type {
  PaginatedReviews,
  Review,
  ReviewFilters,
  ReviewSortBy,
  ReviewStats,
  ReviewSummary,
} from '@shared/types/review.types';

// Repository Interface - Data Access Layer Contract
export interface IReviewRepository {
  // Read Operations (for read-only MVP)
  findById(id: string): Promise<Review | null>;
  findByVenueId(
    venueId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
  findByServiceId(
    serviceId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
  findByUserId(
    userId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number
  ): Promise<PaginatedReviews>;

  // Statistics Operations
  getVenueStats(venueId: string): Promise<ReviewStats>;
  getServiceStats(serviceId: string): Promise<ReviewStats>;
  getVenueSummary(venueId: string, limit?: number): Promise<ReviewSummary>;
  getServiceSummary(serviceId: string, limit?: number): Promise<ReviewSummary>;

  // Search and Filter Operations
  findAll(
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
  count(filters?: ReviewFilters): Promise<number>;

  // Admin Operations (for future moderation)
  updateVisibility(id: string, isVisible: boolean): Promise<Review | null>;
}

// Use Cases Interfaces
export interface IGetReviewsUseCase {
  execute(
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
}

export interface IGetReviewByIdUseCase {
  execute(id: string): Promise<Review | null>;
}

export interface IGetVenueReviewsUseCase {
  execute(
    venueId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
}

export interface IGetServiceReviewsUseCase {
  execute(
    serviceId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
}

export interface IGetUserReviewsUseCase {
  execute(
    userId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number
  ): Promise<PaginatedReviews>;
}

export interface IGetReviewStatsUseCase {
  execute(venueId?: string, serviceId?: string): Promise<ReviewStats>;
}

export interface IGetReviewSummaryUseCase {
  execute(venueId?: string, serviceId?: string, limit?: number): Promise<ReviewSummary>;
}

// Service Interface - Business Logic Layer Contract
export interface IReviewService {
  // Core Read Operations
  getReviews(
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
  getReviewById(id: string): Promise<Review | null>;

  // Entity-specific Operations
  getVenueReviews(
    venueId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
  getServiceReviews(
    serviceId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
  getUserReviews(
    userId: string,
    filters?: ReviewFilters,
    page?: number,
    limit?: number
  ): Promise<PaginatedReviews>;

  // Statistics and Summary
  getVenueStats(venueId: string): Promise<ReviewStats>;
  getServiceStats(serviceId: string): Promise<ReviewStats>;
  getVenueSummary(venueId: string, limit?: number): Promise<ReviewSummary>;
  getServiceSummary(serviceId: string, limit?: number): Promise<ReviewSummary>;

  // Validation and Utilities
  validateReviewFilters(filters: ReviewFilters): ReviewFilters;
  calculateAverageRating(reviews: Review[]): number;
  calculateRatingDistribution(reviews: Review[]): Record<number, number>;
}

// Domain Events (for future expansion)
export interface ReviewDomainEvent {
  type: 'REVIEW_VIEWED' | 'REVIEW_FILTERED' | 'STATS_CALCULATED';
  payload: {
    reviewId?: string;
    venueId?: string;
    serviceId?: string;
    userId?: string;
    filters?: ReviewFilters;
    timestamp: Date;
  };
}

// Domain Exceptions
export class ReviewNotFoundError extends Error {
  constructor(id: string) {
    super(`Review with ID ${id} not found`);
    this.name = 'ReviewNotFoundError';
  }
}

export class InvalidReviewFiltersError extends Error {
  constructor(message: string) {
    super(`Invalid review filters: ${message}`);
    this.name = 'InvalidReviewFiltersError';
  }
}

export class ReviewAccessDeniedError extends Error {
  constructor(message: string = 'Access denied to review data') {
    super(message);
    this.name = 'ReviewAccessDeniedError';
  }
}
