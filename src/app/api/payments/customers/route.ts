import { NextRequest, NextResponse } from 'next/server';

import { StripeService } from '@/libs/services/stripe/stripeService';
import { userRepository } from '@/libs/data/repositories/UserRepository';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

function createResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    error,
    message,
    success,
    timestamp: new Date().toISOString(),
  });
}

interface CreateCustomerRequest {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCustomerRequest = await request.json();
    const { email, metadata, name, phone, userId } = body;

    if (!userId || !email || !name) {
      return createResponse(
        false,
        'Missing required fields',
        undefined,
        'userId, email, and name are required'
      );
    }

    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      return createResponse(
        false,
        'User not found',
        undefined,
        'User with the specified ID does not exist'
      );
    }

    // Check if user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      try {
        const existingCustomer = await StripeService.retrieveCustomer(user.stripeCustomerId);
        return createResponse(true, 'Customer already exists', {
          customerId: existingCustomer.id,
          email: existingCustomer.email,
          metadata: existingCustomer.metadata,
          name: existingCustomer.name,
          phone: existingCustomer.phone,
        });
      } catch (_error) {
        // Customer might have been deleted in Stripe, continue to create new one
        console.warn(
          `Existing Stripe customer ${user.stripeCustomerId} not found, creating new one`
        );
      }
    }

    // Create customer in Stripe
    const customer = await StripeService.createCustomer({
      email,
      metadata: {
        userId,
        ...metadata,
      },
      name,
      phone,
    });

    // Update user with Stripe customer ID
    await userRepository.update(userId, {
      stripeCustomerId: customer.id,
    });

    return createResponse(true, 'Customer created successfully', {
      customerId: customer.id,
      email: customer.email,
      metadata: customer.metadata,
      name: customer.name,
      phone: customer.phone,
    });
  } catch (error) {
    console.error('POST /api/payments/customers error:', error);
    return createResponse(
      false,
      'Failed to create customer',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
