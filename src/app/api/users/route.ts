import { NextRequest, NextResponse } from 'next/server';

import { AuthMiddleware } from '@/libs/services/auth/authMiddleware';
import { userManagementUseCase } from '@/modules/mod-auth/domain/use-cases/UserManagementUseCase';
import { UserRole } from '@prisma/client';

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

export const GET = AuthMiddleware.withRole(
  ['ADMIN', 'MANAGER'],
  async (request: NextRequest, _user) => {
    try {
      const { searchParams } = new URL(request.url);

      const filters = {
        email: searchParams.get('email') || undefined,
        isActive: searchParams.get('isActive')
          ? searchParams.get('isActive') === 'true'
          : undefined,
        role: (searchParams.get('role') as UserRole) || undefined,
        search: searchParams.get('search') || undefined,
      };

      const pagination = {
        limit: parseInt(searchParams.get('limit') || '10'),
        page: parseInt(searchParams.get('page') || '1'),
      };

      const result = await userManagementUseCase.getUsers(filters, pagination);

      return createResponse(true, 'Users retrieved successfully', result);
    } catch (error) {
      console.error('GET /api/users error:', error);
      return createResponse(
        false,
        'Failed to retrieve users',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

export const POST = AuthMiddleware.withRole(['ADMIN'], async (request: NextRequest, _user) => {
  try {
    const body = await request.json();

    const { confirmPassword, email, firstName, lastName, password, phone, role } = body;

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return createResponse(
        false,
        'Missing required fields',
        undefined,
        'Email, password, confirmPassword, firstName, and lastName are required'
      );
    }

    const userData = {
      confirmPassword,
      email,
      firstName,
      lastName,
      password,
      phone,
      role: (role as UserRole) || UserRole.USER,
    };

    const newUser = await userManagementUseCase.createUser(userData);

    return createResponse(true, 'User created successfully', newUser);
  } catch (error) {
    console.error('POST /api/users error:', error);
    return createResponse(
      false,
      'Failed to create user',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});
