import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/auth/profile
 * Validates JWT token and returns user profile information
 */
export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          message: 'Token de autorización requerido',
          success: false,
        },
        { status: 401 }
      );
    }

    // Extract and verify token
    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError: any) {
      console.error('JWT verification failed:', jwtError.message);

      // Provide specific error messages for different JWT errors
      let errorMessage = 'Token inválido';
      if (jwtError.name === 'TokenExpiredError') {
        errorMessage = 'Token expirado. Por favor inicia sesión nuevamente.';
      } else if (jwtError.name === 'JsonWebTokenError') {
        errorMessage = 'Token malformado. Por favor inicia sesión nuevamente.';
      }

      return NextResponse.json(
        {
          code: jwtError.name,
          message: errorMessage,
          success: false,
        },
        { status: 401 }
      );
    }

    // Validate token payload
    if (!decoded?.userId) {
      return NextResponse.json(
        {
          message: 'Token inválido - no contiene información de usuario',
          success: false,
        },
        { status: 401 }
      );
    }

    // Get user from database with business account info
    const user = await prisma.user.findUnique({
      select: {
        businessAccount: {
          select: {
            address: true,
            businessName: true,
            businessType: true,
            id: true,
          },
        },
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        phone: true,
        role: true,
        stripeCustomerId: true,
        updatedAt: true,
      },
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: 'Usuario no encontrado',
          success: false,
        },
        { status: 404 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          message: 'Cuenta desactivada. Contacta al administrador.',
          success: false,
        },
        { status: 403 }
      );
    }

    // Format response to match expected interface
    const userProfile = {
      createdAt: user.createdAt.toISOString(),
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      isActive: user.isActive,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`.trim() || user.email,
      phone: user.phone,
      role: user.role,
      stripeCustomerId: user.stripeCustomerId,
      updatedAt: user.updatedAt.toISOString(),
      // Business account info if available
      ...(user.businessAccount && {
        address: user.businessAccount.address,
        businessName: user.businessAccount.businessName,
        businessType: user.businessAccount.businessType,
      }),
    };

    return NextResponse.json({
      data: userProfile,
      message: 'Perfil obtenido exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      {
        message: 'Error interno del servidor',
        success: false,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
