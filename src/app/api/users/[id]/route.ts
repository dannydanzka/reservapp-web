import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get user by ID (Admin only)
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

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Acceso denegado. Se requiere rol de administrador', success: false },
        { status: 403 }
      );
    }

    const params = await context.params;
    const user = await prisma.user.findUnique({
      select: {
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
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: user,
      success: true,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Update user (Admin only)
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

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Acceso denegado. Se requiere rol de administrador', success: false },
        { status: 403 }
      );
    }

    const params = await context.params;
    const body = await request.json();
    const { firstName, isActive, lastName, password, phone, role } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado', success: false },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle password update
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      data: updateData,
      select: {
        email: true,
        firstName: true,
        id: true,
        isActive: true,
        lastName: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
      where: { id: params.id },
    });

    return NextResponse.json({
      data: updatedUser,
      message: 'Usuario actualizado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Delete user (soft delete - Admin only)
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

    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Acceso denegado. Se requiere rol de administrador', success: false },
        { status: 403 }
      );
    }

    const params = await context.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado', success: false },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (params.id === decoded.userId) {
      return NextResponse.json(
        { message: 'No puedes eliminar tu propia cuenta', success: false },
        { status: 400 }
      );
    }

    // Check if user has active reservations
    const activeReservations = await prisma.reservation.count({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        userId: params.id,
      },
    });

    if (activeReservations > 0) {
      return NextResponse.json(
        {
          message: 'No se puede eliminar el usuario porque tiene reservas activas',
          success: false,
        },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    const deletedUser = await prisma.user.update({
      data: { isActive: false },
      where: { id: params.id },
    });

    return NextResponse.json({
      data: deletedUser,
      message: 'Usuario eliminado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
