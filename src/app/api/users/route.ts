import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get users (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autorización requerido', success: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    // Check if user is admin or super admin
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { message: 'Acceso denegado. Se requiere rol de administrador', success: false },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Build select clause based on user role
    const includeBusinessInfo = decoded.role === 'SUPER_ADMIN';

    // Get users
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          createdAt: true,
          email: true,
          firstName: true,
          id: true,
          isActive: true,
          lastName: true,
          phone: true,
          role: true,
          updatedAt: true,
          // Include business account information for SUPER_ADMIN only
          ...(includeBusinessInfo && {
            businessAccount: {
              select: {
                businessName: true,
                businessType: true,
                contactEmail: true,
                contactPhone: true,
                isVerified: true,
              },
            },
          }),
        },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      meta: {
        includesBusinessInfo: includeBusinessInfo,
      },
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
      success: true,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create user (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autorización requerido', success: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Acceso denegado. Se requiere rol de administrador', success: false },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, firstName, lastName, phone, role } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { message: 'Nombre, apellido, email y rol son requeridos', success: false },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'El usuario ya existe', success: false },
        { status: 400 }
      );
    }

    // Create user with temporary password
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        isActive: true,
        lastName,
        password: 'temp-password',

        phone,
        // Should be handled properly in real implementation
        role,
      },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({
      data: user,
      message: 'Usuario creado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
