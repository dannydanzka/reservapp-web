/**
 * Review Domain Types
 * Types and interfaces for the Reviews & Ratings system
 */

// Core Review Entity
export interface Review {
  id: string;
  rating: number; // 1-5 stars
  title?: string;
  comment?: string;
  isVerified: boolean;
  isVisible: boolean;
  helpfulVotes: number;
  reportCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  userId: string;
  venueId?: string;
  serviceId?: string;
  reservationId?: string;

  // Populated relations (optional)
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  venue?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
  };
  reservation?: {
    id: string;
    confirmationId: string;
  };
}

// Review Statistics
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  recentReviews: number; // Last 30 days
}

// Review Filters for API queries
export interface ReviewFilters {
  rating?: number; // Filter by specific rating
  minRating?: number; // Filter by minimum rating
  maxRating?: number; // Filter by maximum rating
  isVerified?: boolean;
  isVisible?: boolean;
  userId?: string;
  venueId?: string;
  serviceId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasComment?: boolean; // Only reviews with text comments
}

// Review Sort Options
export type ReviewSortBy =
  | 'newest'
  | 'oldest'
  | 'rating_high'
  | 'rating_low'
  | 'helpful'
  | 'verified';

// Paginated Reviews Response
export interface PaginatedReviews {
  reviews: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  stats?: ReviewStats;
}

// Review API Response Types
export interface ReviewApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Review Summary for Venues/Services
export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  recentReviews: Review[]; // Last 3-5 reviews
  hasMore: boolean;
}

// Review Display Options
export interface ReviewDisplayOptions {
  showUserName?: boolean;
  showVerifiedBadge?: boolean;
  showReservationLink?: boolean;
  maxCommentLength?: number;
  showHelpfulVotes?: boolean;
  showReportOption?: boolean;
}

// Review Creation Data (for future use)
export interface CreateReviewData {
  rating: number;
  title?: string;
  comment?: string;
  venueId?: string;
  serviceId?: string;
  reservationId?: string;
  metadata?: Record<string, any>;
}

// Review Update Data (for admin moderation)
export interface UpdateReviewData {
  isVisible?: boolean;
  reportCount?: number;
  metadata?: Record<string, any>;
}

// Review Error Types
export type ReviewError =
  | 'REVIEW_NOT_FOUND'
  | 'INVALID_RATING'
  | 'MISSING_TARGET'
  | 'UNAUTHORIZED_ACCESS'
  | 'GET_REVIEWS_ERROR'
  | 'GET_REVIEW_STATS_ERROR';

export default Review;
