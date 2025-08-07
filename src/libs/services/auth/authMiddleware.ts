import { NextRequest } from 'next/server';

import { User, UserRole } from '@/modules/mod-auth/domain/interfaces/auth.interfaces';

import { JWTService } from './jwtService';

interface AuthenticatedRequest extends NextRequest {
  user: User;
}

/**
 * Middleware for JWT authentication in API routes
 */
export class AuthMiddleware {
  /**
   * Verify JWT token from request headers
   */
  static async verifyToken(request: NextRequest): Promise<User> {
    const authHeader = request.headers.get('authorization');
    const token = JWTService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new Error('Token de autorización requerido');
    }

    try {
      const payload = JWTService.verifyToken(token);

      // In a real app, you would fetch user from database
      // For now, we'll return the user data from the token
      return {
        createdAt: new Date().toISOString(),
        email: payload.email,
        id: payload.userId,
        // This would come from database
        isActive: true,

        name: '',

        role: payload.role as UserRole,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Higher-order function to protect API routes with JWT authentication
   */
  static withAuth<T = any>(
    handler: (request: NextRequest, user: User) => Promise<Response | { [key: string]: any }>
  ) {
    return async (request: NextRequest): Promise<Response> => {
      try {
        const user = await AuthMiddleware.verifyToken(request);
        const result = await handler(request, user);

        // If result is already a Response, return it
        if (result instanceof Response) {
          return result;
        }

        // Otherwise, convert to JSON response
        return Response.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error de autenticación';

        return Response.json(
          {
            error: 'AUTHENTICATION_ERROR',
            message,
            success: false,
            timestamp: new Date().toISOString(),
          },
          { status: 401 }
        );
      }
    };
  }

  /**
   * Higher-order function to protect API routes with role-based authorization
   */
  static withRole(
    allowedRoles: string[],
    handler: (request: NextRequest, user: User) => Promise<Response | { [key: string]: any }>
  ) {
    return AuthMiddleware.withAuth(async (request: NextRequest, user: User) => {
      if (!allowedRoles.includes(user.role)) {
        return Response.json(
          {
            error: 'AUTHORIZATION_ERROR',
            message: 'No tienes permisos para acceder a este recurso',
            success: false,
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }

      return handler(request, user);
    });
  }

  /**
   * Extract user information from JWT token without verification (for optional auth)
   */
  static extractUserFromToken(request: NextRequest): User | null {
    try {
      const authHeader = request.headers.get('authorization');
      const token = JWTService.extractTokenFromHeader(authHeader);

      if (!token) {
        return null;
      }

      const payload = JWTService.verifyToken(token);

      return {
        createdAt: new Date().toISOString(),
        email: payload.email,
        id: payload.userId,
        // This would come from database
        isActive: true,

        name: '',

        role: payload.role as UserRole,
        updatedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }
}

export type { AuthenticatedRequest };
