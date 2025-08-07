import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse } from '@/libs/types/api.types';

/**
 * Logout endpoint for web and mobile applications.
 *
 * @param {NextRequest} request - The request object
 * @returns {Promise<NextResponse>} Logout response
 */
export async function POST(_request: NextRequest) {
  try {
    // TODO: Implement token invalidation logic
    // For now, we'll just clear the cookie

    const successResponse: ApiResponse<null> = {
      data: null,
      message: 'Logout successful',
      success: true,
    };

    return NextResponse.json(successResponse, {
      headers: {
        'Set-Cookie': 'auth_token=; HttpOnly; Secure; Path=/; Max-Age=0',
      },
      status: 200,
    });
  } catch (_error) {
    const errorResponse: ApiResponse<null> = {
      error: 'LOGOUT_ERROR',
      message: 'Logout failed',
      success: false,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
