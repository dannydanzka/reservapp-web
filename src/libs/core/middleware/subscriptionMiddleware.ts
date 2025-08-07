import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { BusinessPlan, SubscriptionStatus } from '@/libs/types/api.types';
import { userRepository } from '@/libs/data/repositories/UserRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export interface UserSubscriptionInfo {
  userId: string;
  subscriptionStatus: SubscriptionStatus;
  businessPlan?: BusinessPlan;
  canMakeReservations: boolean;
  maxFavorites: number;
  isSubscriptionExpired: boolean;
  isTrialExpired: boolean;
}

/**
 * Middleware to validate user subscription and add subscription info to request
 */
export async function validateSubscription(request: NextRequest): Promise<{
  success: boolean;
  user?: UserSubscriptionInfo;
  error?: string;
  statusCode?: number;
}> {
  try {
    // Extract JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        error: 'Missing or invalid authorization header',
        statusCode: 401,
        success: false,
      };
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.userId || decoded.id;
    } catch (_jwtError) {
      return {
        error: 'Invalid or expired token',
        statusCode: 401,
        success: false,
      };
    }

    // Get user with subscription info
    const user = await userRepository.findById(userId);
    if (!user) {
      return {
        error: 'User not found',
        statusCode: 404,
        success: false,
      };
    }

    // For now, default to FREE tier since schema doesn't have subscription fields yet
    const subscriptionStatus = SubscriptionStatus.FREE;
    const businessPlan = undefined as BusinessPlan | undefined;

    // Check if subscriptions are expired (always false for now)
    const isSubscriptionExpired = false;
    const isTrialExpired = false;

    // Calculate user capabilities
    let canMakeReservations = false;
    let maxFavorites = 3; // Free tier default

    // For now, all users are free tier - in production this would check actual subscription status
    // if (subscriptionStatus === SubscriptionStatus.PREMIUM && !isSubscriptionExpired) {
    //   canMakeReservations = true;
    //   maxFavorites = 999; // Unlimited for premium
    // } else if (subscriptionStatus === SubscriptionStatus.TRIAL && !isTrialExpired) {
    //   canMakeReservations = true;
    //   maxFavorites = 10; // Trial limits
    // }

    const subscriptionInfo: UserSubscriptionInfo = {
      businessPlan,
      canMakeReservations,
      isSubscriptionExpired,
      isTrialExpired,
      maxFavorites,
      subscriptionStatus,
      userId,
    };

    return {
      success: true,
      user: subscriptionInfo,
    };
  } catch (error) {
    console.error('Subscription validation error:', error);
    return {
      error: 'Internal subscription validation error',
      statusCode: 500,
      success: false,
    };
  }
}

/**
 * Middleware to require premium subscription
 */
export async function requirePremiumSubscription(request: NextRequest): Promise<{
  success: boolean;
  user?: UserSubscriptionInfo;
  response?: NextResponse;
}> {
  const validation = await validateSubscription(request);

  if (!validation.success) {
    return {
      response: NextResponse.json(
        {
          error: validation.error,
          message: 'Subscription validation failed',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: validation.statusCode || 500 }
      ),
      success: false,
    };
  }

  const user = validation.user!;

  // Check if user has premium access
  if (!user.canMakeReservations) {
    const message =
      user.isSubscriptionExpired || user.isTrialExpired
        ? 'Your subscription has expired. Please renew to continue using premium features.'
        : 'Premium subscription required. Please upgrade your account to access this feature.';

    return {
      response: NextResponse.json(
        {
          error: 'PREMIUM_REQUIRED',
          message,
          meta: {
            canUpgrade: user.subscriptionStatus === SubscriptionStatus.FREE,
            isExpired: user.isSubscriptionExpired || user.isTrialExpired,
            subscriptionStatus: user.subscriptionStatus,
          },
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      ),
      success: false,
    };
  }

  return {
    success: true,
    user,
  };
}

/**
 * Middleware to check favorites limit
 */
export async function validateFavoritesLimit(
  request: NextRequest,
  currentFavoriteCount: number
): Promise<{
  success: boolean;
  user?: UserSubscriptionInfo;
  response?: NextResponse;
}> {
  const validation = await validateSubscription(request);

  if (!validation.success) {
    return {
      response: NextResponse.json(
        {
          error: validation.error,
          message: 'Subscription validation failed',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: validation.statusCode || 500 }
      ),
      success: false,
    };
  }

  const user = validation.user!;

  // Check favorites limit
  if (currentFavoriteCount >= user.maxFavorites) {
    return {
      response: NextResponse.json(
        {
          error: 'FAVORITES_LIMIT_REACHED',
          message: `You have reached your favorites limit of ${user.maxFavorites}. Upgrade to premium for unlimited favorites.`,
          meta: {
            canUpgrade: user.subscriptionStatus === SubscriptionStatus.FREE,
            currentCount: currentFavoriteCount,
            maxAllowed: user.maxFavorites,
            subscriptionStatus: user.subscriptionStatus,
          },
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      ),
      success: false,
    };
  }

  return {
    success: true,
    user,
  };
}
