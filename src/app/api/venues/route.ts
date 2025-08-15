import { NextRequest, NextResponse } from 'next/server';

import { extractAndVerifyJWT } from '@libs/middleware/jwtAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get venues (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and verify JWT
    const decoded = extractAndVerifyJWT(request);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = category;
    }

    // Build include clause based on user role
    const includeOwner = decoded.role === 'SUPER_ADMIN';

    // Get venues
    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        include: {
          _count: {
            select: {
              reservations: true,
              services: true,
            },
          },
          // Include owner information for SUPER_ADMIN only
          ...(includeOwner && {
            owner: {
              select: {
                businessAccount: {
                  select: {
                    businessName: true,
                    businessType: true,
                  },
                },
                email: true,
                firstName: true,
                id: true,
                lastName: true,
              },
            },
          }),
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.venue.count({ where }),
    ]);

    return NextResponse.json({
      data: venues,
      meta: {
        includesOwnerInfo: includeOwner,
      },
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
      success: true,
    });
  } catch (error: any) {
    console.error('Get venues error:', error);

    // Handle authentication errors
    if (error.message?.includes('Token') || error.message?.includes('autorización')) {
      return NextResponse.json({ message: error.message, success: false }, { status: 401 });
    }

    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create venue (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Extract and verify JWT
    const decoded = extractAndVerifyJWT(request);

    // Check if user is admin or super admin
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { message: 'Acceso denegado. Se requiere rol de administrador', success: false },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { address, category, city, description, email, name, phone } = body;

    // Validate required fields
    if (!name || !category || !address || !city) {
      return NextResponse.json(
        { message: 'Nombre, categoría, dirección y ciudad son requeridos', success: false },
        { status: 400 }
      );
    }

    // Create venue
    const venue = await prisma.venue.create({
      data: {
        address,
        category,
        city,
        description,
        email,
        isActive: true,
        name,
        phone,
      },
      include: {
        services: {
          select: {
            duration: true,
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: venue,
      message: 'Venue creado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Create venue error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
