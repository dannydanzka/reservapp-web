import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

import { SubscriptionStatus } from '@/libs/types/api.types';
import { userRepository } from '@/libs/data/repositories/UserRepository';
import { UserSubscription } from '@/libs/services/api/types/user.types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

/**
 * Get user subscription status - requires authentication
 * Returns current subscription info including plan features and limitations
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and validate JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Missing or invalid authorization header',
          message: 'Authentication required',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = verify(token, JWT_SECRET) as { userId?: string; id?: string };
      userId = decoded.userId || decoded.id || '';
    } catch (_jwtError) {
      return NextResponse.json(
        {
          error: 'Invalid or expired token',
          message: 'Authentication failed',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Get user subscription info
    const user = await userRepository.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
          message: 'User does not exist',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // For now, default to FREE tier since schema doesn't have subscription fields yet
    // In production, you would add subscriptionStatus, businessPlan, subscriptionEndsAt, trialEndsAt to User model
    const subscriptionStatus = SubscriptionStatus.FREE;
    const businessPlan = undefined;

    // Determine user capabilities based on subscription
    let maxFavorites = 3; // Free tier default
    let canMakeReservations = false; // Free users can only view
    let planFeatures: string[] = ['Ver servicios públicos', 'Información básica de venues'];

    // For now, all users are free tier - in production this would check actual subscription status
    // if (subscriptionStatus === SubscriptionStatus.PREMIUM && businessPlan) {
    //   const plan = BUSINESS_PLANS[businessPlan];
    //   maxFavorites = 999; // Unlimited for premium
    //   canMakeReservations = true;
    //   planFeatures = plan.features;
    // } else if (subscriptionStatus === SubscriptionStatus.TRIAL) {
    //   maxFavorites = 10; // Trial limits
    //   canMakeReservations = true;
    //   planFeatures = [
    //     'Acceso completo durante período de prueba',
    //     'Reservas ilimitadas',
    //     'Información completa de servicios',
    //     'Soporte por email'
    //   ];
    // }

    const subscriptionData: UserSubscription = {
      businessPlan,

      canMakeReservations,

      // Will be added when schema is updated
      maxFavorites,

      planFeatures,

      subscriptionEndsAt: undefined,

      subscriptionStatus,
      // Will be added when schema is updated
      trialEndsAt: undefined,
    };

    return NextResponse.json({
      data: subscriptionData,
      message: 'Subscription status retrieved successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error fetching subscription status',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
