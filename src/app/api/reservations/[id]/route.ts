import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get reservation by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    // Build where clause (users can only see their own reservations, admins see all)
    const where: any = { id };
    if (decoded.role !== 'ADMIN') {
      where.userId = decoded.userId;
    }

    const reservation = await prisma.reservation.findFirst({
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
      where,
    });

    if (!reservation) {
      return NextResponse.json(
        { message: 'Reserva no encontrada', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: reservation,
      success: true,
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Update reservation
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

    const { id } = await params;
    const body = await request.json();

    // Build where clause (users can only update their own reservations, admins can update all)
    const where: any = { id };
    if (decoded.role !== 'ADMIN') {
      where.userId = decoded.userId;
    }

    // Check if reservation exists and user has permission
    const existingReservation = await prisma.reservation.findFirst({ where });
    if (!existingReservation) {
      return NextResponse.json(
        { message: 'Reserva no encontrada', success: false },
        { status: 404 }
      );
    }

    // Update reservation
    const reservation = await prisma.reservation.update({
      data: {
        ...body,
        updatedAt: new Date(),
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
      where: { id },
    });

    return NextResponse.json({
      data: reservation,
      message: 'Reserva actualizada exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Delete reservation
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

    const { id } = await params;

    // Build where clause (users can only delete their own reservations, admins can delete all)
    const where: any = { id };
    if (decoded.role !== 'ADMIN') {
      where.userId = decoded.userId;
    }

    // Check if reservation exists and user has permission
    const existingReservation = await prisma.reservation.findFirst({ where });
    if (!existingReservation) {
      return NextResponse.json(
        { message: 'Reserva no encontrada', success: false },
        { status: 404 }
      );
    }

    // Delete reservation
    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Reserva eliminada exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
