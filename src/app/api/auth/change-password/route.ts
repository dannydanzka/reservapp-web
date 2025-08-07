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
 * POST /api/auth/change-password
 * Change current user password
 */
export const POST = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { confirmPassword, currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return createResponse(false, 'Todos los campos son requeridos', null, 'MISSING_FIELDS');
    }

    // Use the changePassword method which handles all validation internally
    await userManagementUseCase.changePassword({
      confirmPassword,
      currentPassword,
      id: user.id,
      newPassword,
    });

    return createResponse(true, 'Contraseña actualizada exitosamente', {
      message: 'Tu contraseña ha sido cambiada correctamente',
    });
  } catch (error: unknown) {
    console.error('Error changing password:', error);
    return createResponse(
      false,
      'Error al cambiar la contraseña',
      null,
      (error as Error).message ?? 'PASSWORD_CHANGE_ERROR'
    );
  }
});
