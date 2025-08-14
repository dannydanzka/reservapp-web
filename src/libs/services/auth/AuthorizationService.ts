import { NextRequest } from 'next/server';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { User, UserRoleEnum } from '@prisma/client';

/**
 * Authenticate admin users (SUPER_ADMIN role only)
 */
export async function authenticateAdmin(
  request: NextRequest,
  requiredRoles: string[] = ['SUPER_ADMIN']
): Promise<{ user: User }> {
  try {
    // First verify the token and get the user
    const user = await AuthMiddleware.verifyToken(request);

    // Check if user has the required role
    if (!requiredRoles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }

    return { user };
  } catch (error) {
    throw new Error('Authentication failed');
  }
}
