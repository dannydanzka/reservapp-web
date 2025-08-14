import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get services with filters and pagination
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const venueId = searchParams.get('venueId');

    // Build where clause
    const where: any = {};

    // Note: Venue ownership filter removed - all authenticated users can see all services
    // In production, implement proper venue ownership model

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = category;
    }
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    if (venueId) {
      where.venueId = venueId;
    }

    // Build include clause based on user role
    const includeOwner = decoded.role === 'SUPER_ADMIN';

    // Get services
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        include: {
          venue: {
            select: {
              category: true,
              id: true,
              name: true,
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
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      data: services,
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
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create new service
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

    const body = await request.json();
    const {
      amenities = [],
      capacity,
      category,
      description,
      duration,
      images = [],
      isActive = true,
      name,
      price,
      venueId,
    } = body;

    // Validate required fields
    if (!name || !category || !price || !duration || !capacity || !venueId) {
      return NextResponse.json(
        {
          message: 'Nombre, categoría, precio, duración, capacidad y venue son requeridos',
          success: false,
        },
        { status: 400 }
      );
    }

    // Verify venue exists and user has permission
    const venue = await prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ message: 'Venue no encontrado', success: false }, { status: 404 });
    }

    // Note: Venue ownership verification removed - all authenticated users can create services
    // In production, implement proper venue ownership model

    // Create service
    const service = await prisma.service.create({
      data: {
        amenities,
        capacity: parseInt(capacity),
        category,
        currency: 'EUR',
        description,
        duration: parseInt(duration),
        images,
        isActive,
        name,
        price: parseFloat(price),
        venueId, // Default currency
      },
      include: {
        venue: {
          select: {
            category: true,
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: service,
      message: 'Servicio creado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
