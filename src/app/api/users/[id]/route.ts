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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return AuthMiddleware.withRole(['ADMIN', 'MANAGER'], async (req: NextRequest, _user) => {
    const { id } = await params;

    try {
      const { searchParams } = new URL(req.url);
      const includeReservations = searchParams.get('includeReservations') === 'true';

      if (includeReservations) {
        const userData = await userManagementUseCase.getUserWithReservations(id);
        if (!userData) {
          return createResponse(
            false,
            'User not found',
            undefined,
            'User with the specified ID does not exist'
          );
        }

        return createResponse(true, 'User retrieved successfully', userData);
      } else {
        const userData = await userManagementUseCase.getUserById(id);
        if (!userData) {
          return createResponse(
            false,
            'User not found',
            undefined,
            'User with the specified ID does not exist'
          );
        }

        return createResponse(true, 'User retrieved successfully', userData);
      }
    } catch (error) {
      console.error(`GET /api/users/${id} error:`, error);
      return createResponse(
        false,
        'Failed to retrieve user',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  })(request);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return AuthMiddleware.withRole(['ADMIN'], async (req: NextRequest, _user) => {
    const { id } = await params;

    try {
      const body = await req.json();

      const { email, firstName, isActive, lastName, phone, role } = body;

      const updateData = {
        email,
        firstName,
        id,
        isActive,
        lastName,
        phone,
        role: role as UserRole,
      };

      const updatedUser = await userManagementUseCase.updateUser(updateData);
      return createResponse(true, 'User updated successfully', updatedUser);
    } catch (error) {
      console.error(`PUT /api/users/${id} error:`, error);
      return createResponse(
        false,
        'Failed to update user',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  })(request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return AuthMiddleware.withRole(['ADMIN'], async (_req: NextRequest, _user) => {
    const { id } = await params;

    try {
      await userManagementUseCase.deleteUser(id);
      return createResponse(true, 'User deleted successfully');
    } catch (error) {
      console.error(`DELETE /api/users/${id} error:`, error);
      return createResponse(
        false,
        'Failed to delete user',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  })(request);
}
