import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get venue by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const venue = await prisma.venue.findUnique({
      include: {
        services: {
          select: {
            description: true,
            duration: true,
            id: true,
            isActive: true,
            name: true,
            price: true,
          },
          where: { isActive: true },
        },
      },
      where: { id },
    });

    if (!venue) {
      return NextResponse.json({ message: 'Venue no encontrado', success: false }, { status: 404 });
    }

    return NextResponse.json({
      data: venue,
      success: true,
    });
  } catch (error) {
    console.error('Get venue error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Update venue (Admin only)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const body = await request.json();

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id },
    });

    if (!existingVenue) {
      return NextResponse.json({ message: 'Venue no encontrado', success: false }, { status: 404 });
    }

    // Update venue
    const venue = await prisma.venue.update({
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        services: {
          select: {
            description: true,
            duration: true,
            id: true,
            isActive: true,
            name: true,
            price: true,
          },
        },
      },
      where: { id },
    });

    return NextResponse.json({
      data: venue,
      message: 'Venue actualizado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Update venue error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Delete venue (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id },
    });

    if (!existingVenue) {
      return NextResponse.json({ message: 'Venue no encontrado', success: false }, { status: 404 });
    }

    // Delete venue (this will also delete related services due to cascade)
    await prisma.venue.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Venue eliminado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Delete venue error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
