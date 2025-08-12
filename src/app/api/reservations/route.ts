import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get reservations
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
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    if (decoded.role !== 'ADMIN') {
      where.userId = decoded.userId;
    }
    if (status) {
      where.status = status;
    }

    // Get reservations
    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        include: {
          service: {
            select: { id: true, name: true, price: true },
          },
          user: {
            select: { email: true, firstName: true, id: true, lastName: true },
          },
          venue: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.reservation.count({ where }),
    ]);

    return NextResponse.json({
      data: reservations,
      pagination: {
        limit,
        page,
        pages: Math.ceil(total / limit),
        total,
      },
      success: true,
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create reservation
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
      checkInDate,
      checkOutDate,
      guests = 1,
      notes,
      serviceId,
      totalAmount = 0,
      venueId,
    } = body;

    // Validate required fields
    if (!venueId || !serviceId || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { message: 'Venue, servicio, fecha de entrada y salida son requeridos', success: false },
        { status: 400 }
      );
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        guests,
        notes,
        serviceId,
        status: 'PENDING',
        totalAmount,
        userId: decoded.userId,
        venueId,
      },
      include: {
        service: {
          select: { id: true, name: true, price: true },
        },
        user: {
          select: { email: true, firstName: true, id: true, lastName: true },
        },
        venue: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      data: reservation,
      message: 'Reserva creada exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
