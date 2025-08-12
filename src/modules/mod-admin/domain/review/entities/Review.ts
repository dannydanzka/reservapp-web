/**
 * Review Entity - Domain Layer
 * Core business entity for review and rating management
 */

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  reservationId?: string;
  rating: ReviewRating;
  content: ReviewContent;
  moderation: ReviewModeration;
  engagement: ReviewEngagement;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewRating {
  overall: number; // 1-5 scale
  aspects: {
    service?: number;
    ambiance?: number;
    value?: number;
    cleanliness?: number;
    location?: number;
  };
}

export interface ReviewContent {
  title?: string;
  text: string;
  pros?: string[];
  cons?: string[];
  images?: ReviewImage[];
  tags?: string[];
}

export interface ReviewImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface ReviewModeration {
  status: ModerationStatus;
  moderatedAt?: Date;
  moderatorId?: string;
  moderationReason?: string;
  flags: ReviewFlag[];
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
  HIDDEN = 'HIDDEN',
}

export interface ReviewFlag {
  id: string;
  reason: FlagReason;
  reporterId: string;
  reportedAt: Date;
  resolved: boolean;
}

export enum FlagReason {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  SPAM = 'SPAM',
  FAKE_REVIEW = 'FAKE_REVIEW',
  PERSONAL_ATTACK = 'PERSONAL_ATTACK',
  IRRELEVANT = 'IRRELEVANT',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
}

export interface ReviewEngagement {
  helpfulCount: number;
  notHelpfulCount: number;
  replyCount: number;
  shareCount: number;
  replies?: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  authorId: string;
  authorType: 'VENUE' | 'USER' | 'MODERATOR';
  content: string;
  createdAt: Date;
  isOfficial: boolean;
}

export interface ReviewSummary {
  venueId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  aspectRatings: {
    service?: number;
    ambiance?: number;
    value?: number;
    cleanliness?: number;
    location?: number;
  };
  recentTrend: {
    period: string;
    change: number;
  };
}
