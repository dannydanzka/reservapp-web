import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse } from '@/libs/types/api.types';
import { StripeService } from '@/libs/services/stripe/stripeService';

export interface CreateSubscriptionPaymentRequest {
  businessName: string;
  email: string;
  amount: number;
  currency: string;
  planType: 'inicial' | 'profesional' | 'enterprise';
}

export interface CreateSubscriptionPaymentResponse {
  paymentIntentId: string;
  clientSecret: string;
  customerId?: string;
  amount: number;
  currency: string;
}

/**
 * Create payment intent for business subscription
 * POST /api/payments/subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriptionPaymentRequest = await request.json();

    // Validate request body
    if (!body.businessName || !body.email || !body.amount || !body.currency || !body.planType) {
      const errorResponse: ApiResponse<null> = {
        error: 'MISSING_FIELDS',
        message: 'Business name, email, amount, currency, and plan type are required',
        success: false,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate amount (must be positive)
    if (body.amount <= 0) {
      const errorResponse: ApiResponse<null> = {
        error: 'INVALID_AMOUNT',
        message: 'Amount must be greater than zero',
        success: false,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create or retrieve Stripe customer
    let customerId: string | undefined;

    try {
      const customer = await StripeService.createCustomer({
        email: body.email,
        metadata: {
          businessName: body.businessName,
          registrationFlow: 'true',
          subscriptionType: body.planType,
        },
        name: body.businessName,
      });
      customerId = customer.id;
    } catch (customerError) {
      console.warn('Could not create customer, proceeding without:', customerError);
    }

    // Create payment intent for subscription
    const paymentIntent = await StripeService.createPaymentIntent({
      amount: body.amount,
      currency: body.currency,
      customerId,
      description: `Suscripción mensual - ${body.businessName}`,
      // Temporary ID for subscription flow
      metadata: {
        businessName: body.businessName,
        email: body.email,
        subscriptionFlow: 'registration',
        subscriptionType: body.planType,
      },
      reservationId: `subscription_${Date.now()}`,
    });

    const responseData: CreateSubscriptionPaymentResponse = {
      amount: body.amount,
      clientSecret: paymentIntent.client_secret!,
      currency: body.currency,
      customerId,
      paymentIntentId: paymentIntent.id,
    };

    const successResponse: ApiResponse<CreateSubscriptionPaymentResponse> = {
      data: responseData,
      message: 'Payment intent created successfully',
      success: true,
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error('Error creating subscription payment intent:', error);

    const errorResponse: ApiResponse<null> = {
      error: 'STRIPE_ERROR',
      message: error instanceof Error ? error.message : 'Failed to create payment intent',
      success: false,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * Confirm subscription payment and retrieve payment intent status
 * GET /api/payments/subscription?payment_intent_id={id}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      const errorResponse: ApiResponse<null> = {
        error: 'MISSING_PAYMENT_INTENT_ID',
        message: 'Payment intent ID is required',
        success: false,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await StripeService.retrievePaymentIntent(paymentIntentId);

    const responseData = {
      amount: paymentIntent.amount / 100,
      // Convert from cents
      currency: paymentIntent.currency,

      customerId: paymentIntent.customer as string,
      metadata: paymentIntent.metadata,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    };

    const successResponse: ApiResponse<typeof responseData> = {
      data: responseData,
      message: 'Payment intent retrieved successfully',
      success: true,
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);

    const errorResponse: ApiResponse<null> = {
      error: 'STRIPE_ERROR',
      message: error instanceof Error ? error.message : 'Failed to retrieve payment intent',
      success: false,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
