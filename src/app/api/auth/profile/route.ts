import { NextRequest, NextResponse } from 'next/server';

import { AuthMiddleware } from '@/libs/services/auth/authMiddleware';
import { userManagementUseCase } from '@/modules/mod-auth/domain/use-cases/UserManagementUseCase';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

interface ProfileUpdateData {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
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

/**
 * GET /api/auth/profile
 * Get current user profile
 */
export const GET = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    const userProfile = await userManagementUseCase.getUserById(user.id);

    if (!userProfile) {
      return createResponse(false, 'Usuario no encontrado', null, 'USER_NOT_FOUND');
    }

    return createResponse(true, 'Perfil obtenido exitosamente', userProfile);
  } catch (error: unknown) {
    console.error('Error getting user profile:', error);
    return createResponse(
      false,
      'Error al obtener el perfil del usuario',
      null,
      (error as Error).message ?? 'PROFILE_GET_ERROR'
    );
  }
});

/**
 * PUT /api/auth/profile
 * Update current user profile
 */
export const PUT = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();

    // Only allow updating certain fields for profile
    const allowedFields = ['firstName', 'lastName', 'phone'];
    const updateData: ProfileUpdateData = { id: user.id };

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        (updateData as any)[field] = body[field];
      }
    });

    const updatedUser = await userManagementUseCase.updateUser(updateData);

    return createResponse(true, 'Perfil actualizado exitosamente', updatedUser);
  } catch (error: unknown) {
    console.error('Error updating user profile:', error);
    return createResponse(
      false,
      'Error al actualizar el perfil del usuario',
      null,
      (error as Error).message ?? 'PROFILE_UPDATE_ERROR'
    );
  }
});
