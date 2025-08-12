import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get venues
 */
export async function GET(request: NextRequest) {
  try {
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

    // Get venues
    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.venue.count({ where }),
    ]);

    return NextResponse.json({
      data: venues,
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
      success: true,
    });
  } catch (error) {
    console.error('Get venues error:', error);
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
