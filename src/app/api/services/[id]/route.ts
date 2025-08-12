import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get service by ID
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

    const params = await context.params;
    const service = await prisma.service.findUnique({
      include: {
        venue: {
          select: {
            address: true,
            category: true,
            city: true,
            id: true,
            name: true,
          },
        },
      },
      where: { id: params.id },
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Servicio no encontrado', success: false },
        { status: 404 }
      );
    }

    // Note: Venue ownership verification removed - all authenticated users can view services
    // In production, implement proper venue ownership model

    return NextResponse.json({
      data: service,
      success: true,
    });
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Update service
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

    const params = await context.params;
    const body = await request.json();
    const { amenities, capacity, category, description, duration, images, isActive, name, price } =
      body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!existingService) {
      return NextResponse.json(
        { message: 'Servicio no encontrado', success: false },
        { status: 404 }
      );
    }

    // Note: Venue ownership verification removed - all authenticated users can update
    // In production, implement proper venue ownership model

    // Update service
    const updatedService = await prisma.service.update({
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category }),
        ...(price && { price: parseFloat(price) }),
        ...(duration && { duration: parseInt(duration) }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(amenities && { amenities }),
        ...(images && { images }),
        ...(isActive !== undefined && { isActive }),
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
      where: { id: params.id },
    });

    return NextResponse.json({
      data: updatedService,
      message: 'Servicio actualizado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Delete service
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

    const params = await context.params;
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!existingService) {
      return NextResponse.json(
        { message: 'Servicio no encontrado', success: false },
        { status: 404 }
      );
    }

    // Note: Venue ownership verification removed - all authenticated users can delete
    // In production, implement proper venue ownership model

    // Check if service has active reservations
    const activeReservations = await prisma.reservation.count({
      where: {
        serviceId: params.id,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (activeReservations > 0) {
      return NextResponse.json(
        {
          message: 'No se puede eliminar el servicio porque tiene reservas activas',
          success: false,
        },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const deletedService = await prisma.service.update({
      data: { isActive: false },
      where: { id: params.id },
    });

    return NextResponse.json({
      data: deletedService,
      message: 'Servicio eliminado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
