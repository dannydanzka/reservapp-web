/**
 * Review Repository Implementation
 * Clean Architecture - Data Layer
 */

import type { IReviewRepository, ReviewNotFoundError } from '@mod-admin/domain/review';
import type {
  PaginatedReviews,
  Review,
  ReviewFilters,
  ReviewSortBy,
  ReviewStats,
  ReviewSummary,
} from '@shared/types/review.types';
import { PrismaService } from '@libs/infrastructure/services/core/database/prismaService';

export class ReviewRepository implements IReviewRepository {
  private readonly prisma = PrismaService.getInstance().getClient();

  async findById(id: string): Promise<Review | null> {
    try {
      const review = await this.prisma.review.findUnique({
        include: {
          reservation: {
            select: {
              confirmationId: true,
              id: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              firstName: true,
              id: true,
              lastName: true,
            },
          },
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: { id },
      });

      return review ? this.mapToReviewEntity(review) : null;
    } catch (error) {
      console.error('Error finding review by ID:', error);
      throw new Error('Failed to find review');
    }
  }

  async findByVenueId(
    venueId: string,
    filters?: ReviewFilters,
    page = 1,
    limit = 10,
    sortBy: ReviewSortBy = 'newest'
  ): Promise<PaginatedReviews> {
    try {
      const where = this.buildWhereClause({ ...filters, venueId });
      const orderBy = this.buildOrderByClause(sortBy);
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        this.prisma.review.findMany({
          include: this.getIncludeClause(),
          orderBy,
          skip,
          take: limit,
          where,
        }),
        this.prisma.review.count({ where }),
      ]);

      return {
        pagination: {
          hasMore: skip + reviews.length < total,
          limit,
          page,
          total,
        },
        reviews: reviews.map(this.mapToReviewEntity),
      };
    } catch (error) {
      console.error('Error finding reviews by venue ID:', error);
      throw new Error('Failed to find venue reviews');
    }
  }

  async findByServiceId(
    serviceId: string,
    filters?: ReviewFilters,
    page = 1,
    limit = 10,
    sortBy: ReviewSortBy = 'newest'
  ): Promise<PaginatedReviews> {
    try {
      const where = this.buildWhereClause({ ...filters, serviceId });
      const orderBy = this.buildOrderByClause(sortBy);
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        this.prisma.review.findMany({
          include: this.getIncludeClause(),
          orderBy,
          skip,
          take: limit,
          where,
        }),
        this.prisma.review.count({ where }),
      ]);

      return {
        pagination: {
          hasMore: skip + reviews.length < total,
          limit,
          page,
          total,
        },
        reviews: reviews.map(this.mapToReviewEntity),
      };
    } catch (error) {
      console.error('Error finding reviews by service ID:', error);
      throw new Error('Failed to find service reviews');
    }
  }

  async findByUserId(
    userId: string,
    filters?: ReviewFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedReviews> {
    try {
      const where = this.buildWhereClause({ ...filters, userId });
      const orderBy = this.buildOrderByClause('newest');
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        this.prisma.review.findMany({
          include: this.getIncludeClause(),
          orderBy,
          skip,
          take: limit,
          where,
        }),
        this.prisma.review.count({ where }),
      ]);

      return {
        pagination: {
          hasMore: skip + reviews.length < total,
          limit,
          page,
          total,
        },
        reviews: reviews.map(this.mapToReviewEntity),
      };
    } catch (error) {
      console.error('Error finding reviews by user ID:', error);
      throw new Error('Failed to find user reviews');
    }
  }

  async getVenueStats(venueId: string): Promise<ReviewStats> {
    try {
      const reviews = await this.prisma.review.findMany({
        select: {
          createdAt: true,
          isVerified: true,
          rating: true,
        },
        where: {
          isVisible: true,
          venueId,
        },
      });

      return this.calculateStats(reviews);
    } catch (error) {
      console.error('Error getting venue stats:', error);
      throw new Error('Failed to get venue statistics');
    }
  }

  async getServiceStats(serviceId: string): Promise<ReviewStats> {
    try {
      const reviews = await this.prisma.review.findMany({
        select: {
          createdAt: true,
          isVerified: true,
          rating: true,
        },
        where: {
          isVisible: true,
          serviceId,
        },
      });

      return this.calculateStats(reviews);
    } catch (error) {
      console.error('Error getting service stats:', error);
      throw new Error('Failed to get service statistics');
    }
  }

  async getVenueSummary(venueId: string, limit = 5): Promise<ReviewSummary> {
    try {
      const stats = await this.getVenueStats(venueId);

      const recentReviews = await this.prisma.review.findMany({
        include: this.getIncludeClause(),
        orderBy: { createdAt: 'desc' },
        take: limit,
        where: {
          isVisible: true,
          venueId,
        },
      });

      return {
        averageRating: stats.averageRating,
        hasMore: stats.totalReviews > limit,
        ratingDistribution: stats.ratingDistribution,
        recentReviews: recentReviews.map(this.mapToReviewEntity),
        totalReviews: stats.totalReviews,
      };
    } catch (error) {
      console.error('Error getting venue summary:', error);
      throw new Error('Failed to get venue review summary');
    }
  }

  async getServiceSummary(serviceId: string, limit = 5): Promise<ReviewSummary> {
    try {
      const stats = await this.getServiceStats(serviceId);

      const recentReviews = await this.prisma.review.findMany({
        include: this.getIncludeClause(),
        orderBy: { createdAt: 'desc' },
        take: limit,
        where: {
          isVisible: true,
          serviceId,
        },
      });

      return {
        averageRating: stats.averageRating,
        hasMore: stats.totalReviews > limit,
        ratingDistribution: stats.ratingDistribution,
        recentReviews: recentReviews.map(this.mapToReviewEntity),
        totalReviews: stats.totalReviews,
      };
    } catch (error) {
      console.error('Error getting service summary:', error);
      throw new Error('Failed to get service review summary');
    }
  }

  async findAll(
    filters?: ReviewFilters,
    page = 1,
    limit = 20,
    sortBy: ReviewSortBy = 'newest'
  ): Promise<PaginatedReviews> {
    try {
      const where = this.buildWhereClause(filters);
      const orderBy = this.buildOrderByClause(sortBy);
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        this.prisma.review.findMany({
          include: this.getIncludeClause(),
          orderBy,
          skip,
          take: limit,
          where,
        }),
        this.prisma.review.count({ where }),
      ]);

      return {
        pagination: {
          hasMore: skip + reviews.length < total,
          limit,
          page,
          total,
        },
        reviews: reviews.map(this.mapToReviewEntity),
      };
    } catch (error) {
      console.error('Error finding all reviews:', error);
      throw new Error('Failed to find reviews');
    }
  }

  async count(filters?: ReviewFilters): Promise<number> {
    try {
      const where = this.buildWhereClause(filters);
      return await this.prisma.review.count({ where });
    } catch (error) {
      console.error('Error counting reviews:', error);
      throw new Error('Failed to count reviews');
    }
  }

  async updateVisibility(id: string, isVisible: boolean): Promise<Review | null> {
    try {
      const updated = await this.prisma.review.update({
        data: { isVisible },
        include: this.getIncludeClause(),
        where: { id },
      });

      return this.mapToReviewEntity(updated);
    } catch (error) {
      console.error('Error updating review visibility:', error);
      throw new Error('Failed to update review visibility');
    }
  }

  // Private helper methods
  private buildWhereClause(filters?: ReviewFilters) {
    if (!filters) return { isVisible: true };

    const where: any = {};

    // Always filter visible reviews unless explicitly requested
    if (filters.isVisible !== undefined) {
      where.isVisible = filters.isVisible;
    } else {
      where.isVisible = true;
    }

    if (filters.rating !== undefined) {
      where.rating = filters.rating;
    }

    if (filters.minRating !== undefined || filters.maxRating !== undefined) {
      where.rating = {
        ...(filters.minRating !== undefined && { gte: filters.minRating }),
        ...(filters.maxRating !== undefined && { lte: filters.maxRating }),
      };
    }

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.venueId) {
      where.venueId = filters.venueId;
    }

    if (filters.serviceId) {
      where.serviceId = filters.serviceId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {
        ...(filters.dateFrom && { gte: filters.dateFrom }),
        ...(filters.dateTo && { lte: filters.dateTo }),
      };
    }

    if (filters.hasComment !== undefined) {
      if (filters.hasComment) {
        where.comment = { not: null };
      } else {
        where.comment = null;
      }
    }

    return where;
  }

  private buildOrderByClause(sortBy: ReviewSortBy) {
    switch (sortBy) {
      case 'oldest':
        return { createdAt: 'asc' as const };
      case 'rating_high':
        return [{ rating: 'desc' as const }, { createdAt: 'desc' as const }];
      case 'rating_low':
        return [{ rating: 'asc' as const }, { createdAt: 'desc' as const }];
      case 'helpful':
        return [{ helpfulVotes: 'desc' as const }, { createdAt: 'desc' as const }];
      case 'verified':
        return [{ isVerified: 'desc' as const }, { createdAt: 'desc' as const }];
      default: // 'newest'
        return { createdAt: 'desc' as const };
    }
  }

  private getIncludeClause() {
    return {
      reservation: {
        select: {
          confirmationId: true,
          id: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          firstName: true,
          id: true,
          lastName: true,
        },
      },
      venue: {
        select: {
          id: true,
          name: true,
        },
      },
    };
  }

  private mapToReviewEntity(prismaReview: any): Review {
    return {
      comment: prismaReview.comment,
      createdAt: prismaReview.createdAt,
      helpfulVotes: prismaReview.helpfulVotes,
      id: prismaReview.id,
      isVerified: prismaReview.isVerified,
      isVisible: prismaReview.isVisible,
      metadata: prismaReview.metadata,
      rating: prismaReview.rating,
      reportCount: prismaReview.reportCount,
      reservation: prismaReview.reservation,
      reservationId: prismaReview.reservationId,
      service: prismaReview.service,
      serviceId: prismaReview.serviceId,
      title: prismaReview.title,
      updatedAt: prismaReview.updatedAt,
      user: prismaReview.user,
      userId: prismaReview.userId,
      venue: prismaReview.venue,
      venueId: prismaReview.venueId,
    };
  }

  private calculateStats(
    reviews: Array<{ rating: number; isVerified: boolean; createdAt: Date }>
  ): ReviewStats {
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
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    const verifiedReviews = reviews.filter((review) => review.isVerified).length;

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = reviews.filter((review) => review.createdAt >= thirtyDaysAgo).length;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      // Round to 1 decimal
      ratingDistribution,
      recentReviews,
      totalReviews,
      verifiedReviews,
    };
  }
}
