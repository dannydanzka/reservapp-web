import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse } from '@/libs/types/api.types';
import {
  BusinessRegistrationData,
  LoginSession,
  RegisterData,
} from '@/modules/mod-auth/domain/interfaces/auth.interfaces';
import { RegisterUseCase } from '@/modules/mod-auth/domain/use-cases/RegisterUseCase';
import { ServerAuthRepository } from '@/modules/mod-auth/data/repositories/ServerAuthRepository';

/**
 * Registration endpoint for web and mobile applications.
 *
 * @param {NextRequest} request - The request object
 * @returns {Promise<NextResponse>} Registration response with session data
 */
export async function POST(request: NextRequest) {
  try {
    const body: RegisterData | BusinessRegistrationData = await request.json();

    // Validate basic required fields
    if (!body.email || !body.password || !body.name) {
      const errorResponse: ApiResponse<null> = {
        error: 'MISSING_FIELDS',
        message: 'Email, password, and name are required',
        success: false,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check if this is a business registration
    const isBusinessRegistration = 'businessName' in body && 'subscriptionPlan' in body;

    if (isBusinessRegistration) {
      const businessData = body as BusinessRegistrationData;

      // Validate business-specific fields
      if (!businessData.businessName || !businessData.phone || !businessData.address) {
        const errorResponse: ApiResponse<null> = {
          error: 'MISSING_BUSINESS_FIELDS',
          message: 'Business name, phone, and address are required for business registration',
          success: false,
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      // Validate payment intent ID for business registration
      if (!businessData.paymentIntentId) {
        const errorResponse: ApiResponse<null> = {
          error: 'MISSING_PAYMENT_VALIDATION',
          message: 'Payment validation is required for business registration',
          success: false,
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }

      console.log('Processing business registration for:', businessData.businessName);
    }

    // Execute registration use case
    const authRepository = new ServerAuthRepository();
    const registerUseCase = new RegisterUseCase(authRepository);

    const session = await registerUseCase.execute(body);

    const successMessage = isBusinessRegistration
      ? 'Business registration successful! Welcome to ReservApp.'
      : 'Registration successful';

    const successResponse: ApiResponse<LoginSession> = {
      data: session,
      message: successMessage,
      success: true,
    };

    // Set session cookie with longer expiration for business accounts
    const maxAge = isBusinessRegistration ? 604800 : 86400; // 7 days vs 1 day

    return NextResponse.json(successResponse, {
      headers: {
        'Set-Cookie': `auth_token=${session.token}; HttpOnly; Secure; Path=/; Max-Age=${maxAge}`,
      },
      status: 201,
    });
  } catch (error) {
    console.error('Registration error:', error);

    const errorResponse: ApiResponse<null> = {
      error: 'REGISTRATION_ERROR',
      message: error instanceof Error ? error.message : 'Registration failed',
      success: false,
    };

    return NextResponse.json(errorResponse, { status: 400 });
  }
}
