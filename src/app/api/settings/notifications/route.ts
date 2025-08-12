import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get user notification settings
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

    // Get or create notification settings
    let notificationSettings = await prisma.userSettings.findUnique({
      where: { userId: decoded.userId },
    });

    // If no settings exist, create default ones
    if (!notificationSettings) {
      notificationSettings = await prisma.userSettings.create({
        data: {
          emailNotifications: true,
          marketingEmails: false,
          pushNotifications: true,
          userId: decoded.userId,
        },
      });
    }

    return NextResponse.json({
      data: {
        emailNotifications: notificationSettings.emailNotifications,
        id: notificationSettings.id,
        marketingEmails: notificationSettings.marketingEmails,
        pushNotifications: notificationSettings.pushNotifications,
        updatedAt: notificationSettings.updatedAt,
      },
      success: true,
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Update user notification settings
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
    const { emailNotifications, marketingEmails, pushNotifications } = body;

    // Update or create notification settings
    const updatedSettings = await prisma.userSettings.upsert({
      create: {
        emailNotifications: emailNotifications ?? true,
        marketingEmails: marketingEmails ?? false,
        pushNotifications: pushNotifications ?? true,
        userId: decoded.userId,
      },
      update: {
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(pushNotifications !== undefined && { pushNotifications }),
        ...(marketingEmails !== undefined && { marketingEmails }),
      },
      where: { userId: decoded.userId },
    });

    return NextResponse.json({
      data: {
        emailNotifications: updatedSettings.emailNotifications,
        id: updatedSettings.id,
        marketingEmails: updatedSettings.marketingEmails,
        pushNotifications: updatedSettings.pushNotifications,
        updatedAt: updatedSettings.updatedAt,
      },
      message: 'Configuración de notificaciones actualizada exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
