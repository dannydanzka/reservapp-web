import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get user profile settings
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

    // Get user profile
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
        updatedAt: true,
      },
      where: { id: decoded.userId },
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
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Update user profile settings
 */
export async function PUT(request: NextRequest) {
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
    const { currentPassword, firstName, lastName, newPassword, phone } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Contraseña actual requerida para cambiar la contraseña', success: false },
          { status: 400 }
        );
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { message: 'Contraseña actual incorrecta', success: false },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedPassword;
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
      where: { id: decoded.userId },
    });

    return NextResponse.json({
      data: updatedUser,
      message: 'Perfil actualizado exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
