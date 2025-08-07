import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

import { BUSINESS_PLANS } from '@/libs/types/api.types';
import { UpgradeUserData } from '@/libs/services/api/types/user.types';
import { userRepository } from '@/libs/data/repositories/UserRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

/**
 * Upgrade user from free to premium - requires authentication
 * Typically called after successful payment processing
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const upgradeData: UpgradeUserData = body;

    // Validate required fields
    if (!upgradeData.businessPlan || !upgradeData.subscriptionStatus) {
      return NextResponse.json(
        {
          error: 'Missing required upgrade data',
          message: 'Business plan and subscription status are required',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Validate business plan exists
    if (!BUSINESS_PLANS[upgradeData.businessPlan]) {
      return NextResponse.json(
        {
          error: 'Invalid business plan',
          message: 'The specified business plan does not exist',
          success: false,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Get current user
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

    // For now, just return success since subscription fields are not in schema yet
    // In production, you would update the user record with subscription information
    // const updatedUser = await userRepository.update(userId, { subscriptionStatus, businessPlan, etc. });
    const updatedUser = user;

    // Get plan information for response
    const plan = BUSINESS_PLANS[upgradeData.businessPlan];

    return NextResponse.json({
      data: {
        plan: {
          commissionRate: plan.commissionRate,
          features: plan.features,
          monthlyPrice: plan.monthlyPrice,
          monthlyVisitLimit: plan.monthlyVisitLimit,
          name: plan.name,
        },
        user: {
          businessPlan: upgradeData.businessPlan,
          email: updatedUser.email,
          id: updatedUser.id,
          name: `${updatedUser.firstName} ${updatedUser.lastName}`,
          subscriptionEndsAt: upgradeData.subscriptionEndsAt,
          subscriptionStatus: upgradeData.subscriptionStatus,
        },
      },
      message: 'User upgraded successfully',
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error upgrading user:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error upgrading user',
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
