/**
 * Review Service
 * Business Logic Layer for Reviews & Ratings
 */

import type {
  PaginatedReviews,
  Review,
  ReviewFilters,
  ReviewSortBy,
  ReviewStats,
  ReviewSummary,
} from '@shared/types/review.types';

// Local error classes since domain layer is not available
class InvalidReviewFiltersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidReviewFiltersError';
  }
}

class ReviewNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReviewNotFoundError';
  }
}

// Interface for review service
interface IReviewService {
  getReviews(
    filters?: ReviewFilters,
    page?: number,
    limit?: number,
    sortBy?: ReviewSortBy
  ): Promise<PaginatedReviews>;
  getReviewById(id: string): Promise<Review | null>;
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
  getVenueStats(venueId: string): Promise<ReviewStats>;
  getServiceStats(serviceId: string): Promise<ReviewStats>;
  getVenueSummary(venueId: string, limit?: number): Promise<ReviewSummary>;
  getServiceSummary(serviceId: string, limit?: number): Promise<ReviewSummary>;
}

// Stub ReviewRepository since it's not available
class ReviewRepository {
  async findAll(
    filters: ReviewFilters,
    page: number,
    limit: number,
    sortBy: ReviewSortBy
  ): Promise<PaginatedReviews> {
    throw new Error('ReviewRepository is disabled');
  }

  async findById(id: string): Promise<Review | null> {
    throw new Error('ReviewRepository is disabled');
  }

  async findByVenueId(
    venueId: string,
    filters: ReviewFilters,
    page: number,
    limit: number,
    sortBy: ReviewSortBy
  ): Promise<PaginatedReviews> {
    throw new Error('ReviewRepository is disabled');
  }

  async findByServiceId(
    serviceId: string,
    filters: ReviewFilters,
    page: number,
    limit: number,
    sortBy: ReviewSortBy
  ): Promise<PaginatedReviews> {
    throw new Error('ReviewRepository is disabled');
  }

  async findByUserId(
    userId: string,
    filters: ReviewFilters,
    page: number,
    limit: number
  ): Promise<PaginatedReviews> {
    throw new Error('ReviewRepository is disabled');
  }

  async getVenueStats(venueId: string): Promise<ReviewStats> {
    throw new Error('ReviewRepository is disabled');
  }

  async getServiceStats(serviceId: string): Promise<ReviewStats> {
    throw new Error('ReviewRepository is disabled');
  }

  async getVenueSummary(venueId: string, limit: number): Promise<ReviewSummary> {
    throw new Error('ReviewRepository is disabled');
  }

  async getServiceSummary(serviceId: string, limit: number): Promise<ReviewSummary> {
    throw new Error('ReviewRepository is disabled');
  }
}

export class ReviewService implements IReviewService {
  private readonly reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async getReviews(
    filters?: ReviewFilters,
    page = 1,
    limit = 20,
    sortBy: ReviewSortBy = 'newest'
  ): Promise<PaginatedReviews> {
    try {
      // Validate pagination parameters
      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.min(100, Math.max(1, limit));

      // Validate and sanitize filters
      const validatedFilters = this.validateReviewFilters(filters || {});

      const result = await this.reviewRepository.findAll(
        validatedFilters,
        validatedPage,
        validatedLimit,
        sortBy
      );

      // Calculate stats if requested and there are reviews
      if (result.reviews.length > 0) {
        result.stats = this.calculateStatsFromReviews(result.reviews);
      }

      return result;
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw new Error('Failed to retrieve reviews');
    }
  }

  async getReviewById(id: string): Promise<Review | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new InvalidReviewFiltersError('Invalid review ID');
      }

      return await this.reviewRepository.findById(id);
    } catch (error) {
      console.error('Error getting review by ID:', error);
      throw new Error('Failed to retrieve review');
    }
  }

  async getVenueReviews(
    venueId: string,
    filters?: ReviewFilters,
    page = 1,
    limit = 10,
    sortBy: ReviewSortBy = 'newest'
  ): Promise<PaginatedReviews> {
    try {
      if (!venueId || typeof venueId !== 'string') {
        throw new InvalidReviewFiltersError('Invalid venue ID');
      }

      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.min(50, Math.max(1, limit));
      const validatedFilters = this.validateReviewFilters(filters || {});

      return await this.reviewRepository.findByVenueId(
        venueId,
        validatedFilters,
        validatedPage,
        validatedLimit,
        sortBy
      );
    } catch (error) {
      console.error('Error getting venue reviews:', error);
      throw new Error('Failed to retrieve venue reviews');
    }
  }

  async getServiceReviews(
    serviceId: string,
    filters?: ReviewFilters,
    page = 1,
    limit = 10,
    sortBy: ReviewSortBy = 'newest'
  ): Promise<PaginatedReviews> {
    try {
      if (!serviceId || typeof serviceId !== 'string') {
        throw new InvalidReviewFiltersError('Invalid service ID');
      }

      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.min(50, Math.max(1, limit));
      const validatedFilters = this.validateReviewFilters(filters || {});

      return await this.reviewRepository.findByServiceId(
        serviceId,
        validatedFilters,
        validatedPage,
        validatedLimit,
        sortBy
      );
    } catch (error) {
      console.error('Error getting service reviews:', error);
      throw new Error('Failed to retrieve service reviews');
    }
  }

  async getUserReviews(
    userId: string,
    filters?: ReviewFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedReviews> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new InvalidReviewFiltersError('Invalid user ID');
      }

      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.min(50, Math.max(1, limit));
      const validatedFilters = this.validateReviewFilters(filters || {});

      return await this.reviewRepository.findByUserId(
        userId,
        validatedFilters,
        validatedPage,
        validatedLimit
      );
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw new Error('Failed to retrieve user reviews');
    }
  }

  async getVenueStats(venueId: string): Promise<ReviewStats> {
    try {
      if (!venueId || typeof venueId !== 'string') {
        throw new InvalidReviewFiltersError('Invalid venue ID');
      }

      return await this.reviewRepository.getVenueStats(venueId);
    } catch (error) {
      console.error('Error getting venue stats:', error);
      throw new Error('Failed to retrieve venue statistics');
    }
  }

  async getServiceStats(serviceId: string): Promise<ReviewStats> {
    try {
      if (!serviceId || typeof serviceId !== 'string') {
        throw new InvalidReviewFiltersError('Invalid service ID');
      }

      return await this.reviewRepository.getServiceStats(serviceId);
    } catch (error) {
      console.error('Error getting service stats:', error);
      throw new Error('Failed to retrieve service statistics');
    }
  }

  async getVenueSummary(venueId: string, limit = 5): Promise<ReviewSummary> {
    try {
      if (!venueId || typeof venueId !== 'string') {
        throw new InvalidReviewFiltersError('Invalid venue ID');
      }

      const validatedLimit = Math.min(20, Math.max(1, limit));
      return await this.reviewRepository.getVenueSummary(venueId, validatedLimit);
    } catch (error) {
      console.error('Error getting venue summary:', error);
      throw new Error('Failed to retrieve venue review summary');
    }
  }

  async getServiceSummary(serviceId: string, limit = 5): Promise<ReviewSummary> {
    try {
      if (!serviceId || typeof serviceId !== 'string') {
        throw new InvalidReviewFiltersError('Invalid service ID');
      }

      const validatedLimit = Math.min(20, Math.max(1, limit));
      return await this.reviewRepository.getServiceSummary(serviceId, validatedLimit);
    } catch (error) {
      console.error('Error getting service summary:', error);
      throw new Error('Failed to retrieve service review summary');
    }
  }

  validateReviewFilters(filters: ReviewFilters): ReviewFilters {
    const validated: ReviewFilters = {};

    // Validate rating filters
    if (filters.rating !== undefined) {
      if (filters.rating < 1 || filters.rating > 5) {
        throw new InvalidReviewFiltersError('Rating must be between 1 and 5');
      }
      validated.rating = filters.rating;
    }

    if (filters.minRating !== undefined) {
      if (filters.minRating < 1 || filters.minRating > 5) {
        throw new InvalidReviewFiltersError('Minimum rating must be between 1 and 5');
      }
      validated.minRating = filters.minRating;
    }

    if (filters.maxRating !== undefined) {
      if (filters.maxRating < 1 || filters.maxRating > 5) {
        throw new InvalidReviewFiltersError('Maximum rating must be between 1 and 5');
      }
      validated.maxRating = filters.maxRating;
    }

    // Validate rating range
    if (filters.minRating !== undefined && filters.maxRating !== undefined) {
      if (filters.minRating > filters.maxRating) {
        throw new InvalidReviewFiltersError('Minimum rating cannot be greater than maximum rating');
      }
    }

    // Validate boolean filters
    if (filters.isVerified !== undefined) {
      validated.isVerified = Boolean(filters.isVerified);
    }

    if (filters.isVisible !== undefined) {
      validated.isVisible = Boolean(filters.isVisible);
    }

    if (filters.hasComment !== undefined) {
      validated.hasComment = Boolean(filters.hasComment);
    }

    // Validate ID filters
    if (filters.userId && typeof filters.userId === 'string') {
      validated.userId = filters.userId;
    }

    if (filters.venueId && typeof filters.venueId === 'string') {
      validated.venueId = filters.venueId;
    }

    if (filters.serviceId && typeof filters.serviceId === 'string') {
      validated.serviceId = filters.serviceId;
    }

    // Validate date filters
    if (filters.dateFrom) {
      validated.dateFrom = new Date(filters.dateFrom);
      if (isNaN(validated.dateFrom.getTime())) {
        throw new InvalidReviewFiltersError('Invalid dateFrom format');
      }
    }

    if (filters.dateTo) {
      validated.dateTo = new Date(filters.dateTo);
      if (isNaN(validated.dateTo.getTime())) {
        throw new InvalidReviewFiltersError('Invalid dateTo format');
      }
    }

    // Validate date range
    if (validated.dateFrom && validated.dateTo && validated.dateFrom > validated.dateTo) {
      throw new InvalidReviewFiltersError('dateFrom cannot be later than dateTo');
    }

    return validated;
  }

  calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
  }

  calculateRatingDistribution(reviews: Review[]): {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  } {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    return distribution;
  }

  // Private helper method to calculate stats from a review array
  private calculateStatsFromReviews(reviews: Review[]): ReviewStats {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentReviews: 0,
        totalReviews: 0,
        verifiedReviews: 0,
      };
    }

    const totalReviews = reviews.length;
    const averageRating = this.calculateAverageRating(reviews);
    const ratingDistribution = this.calculateRatingDistribution(reviews);
    const verifiedReviews = reviews.filter((review) => review.isVerified).length;

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = reviews.filter((review) => review.createdAt >= thirtyDaysAgo).length;

    return {
      averageRating,
      ratingDistribution,
      recentReviews,
      totalReviews,
      verifiedReviews,
    };
  }
}

// Export singleton instance
export const reviewService = new ReviewService();
