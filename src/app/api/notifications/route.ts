import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { NotificationType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get user notifications with filtering and pagination
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const unread = searchParams.get('unread');
    const type = searchParams.get('type');

    // Build where clause
    const where: any = {
      userId: decoded.userId,
    };

    if (unread === 'true') {
      where.isRead = false;
    } else if (unread === 'false') {
      where.isRead = true;
    }

    if (type) {
      where.type = type;
    }

    // Get notifications with pagination
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          createdAt: true,
          id: true,
          isRead: true,
          message: true,
          metadata: true,
          title: true,
          type: true,
          updatedAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.notification.count({ where }),
    ]);

    // Get unread count for the user
    const unreadCount = await prisma.notification.count({
      where: {
        isRead: false,
        userId: decoded.userId,
      },
    });

    return NextResponse.json({
      data: notifications,
      message: 'Notificaciones obtenidas exitosamente',
      meta: {
        unreadCount,
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
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create notification (Admin only or system-generated)
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
    const { message, metadata, title, type, userId } = body;

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { message: 'userId, type, title y message son requeridos', success: false },
        { status: 400 }
      );
    }

    // Validate notification type
    if (!Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        {
          message: `Tipo de notificación inválido. Tipos válidos: ${Object.values(NotificationType).join(', ')}`,
          success: false,
        },
        { status: 400 }
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      select: { firstName: true, id: true, lastName: true },
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { message: 'Usuario destinatario no encontrado', success: false },
        { status: 404 }
      );
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        message,
        metadata: metadata || null,
        title,
        type,
        userId,
      },
      select: {
        createdAt: true,
        id: true,
        isRead: true,
        message: true,
        metadata: true,
        title: true,
        type: true,
        user: {
          select: {
            email: true,
            firstName: true,
            id: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: notification,
      message: 'Notificación creada exitosamente',
      success: true,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Mark notifications as read
 */
export async function PATCH(request: NextRequest) {
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
    const { markAllAsRead, notificationIds } = body;

    let updatedCount = 0;

    if (markAllAsRead === true) {
      // Mark all unread notifications as read for the user
      const result = await prisma.notification.updateMany({
        data: {
          isRead: true,
        },
        where: {
          isRead: false,
          userId: decoded.userId,
        },
      });
      updatedCount = result.count;
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      const result = await prisma.notification.updateMany({
        data: {
          isRead: true,
        },
        where: {
          id: { in: notificationIds },
          userId: decoded.userId, // Ensure user can only mark their own notifications
        },
      });
      updatedCount = result.count;
    } else {
      return NextResponse.json(
        {
          message: 'Se requiere notificationIds (array) o markAllAsRead (boolean)',
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: {
        updatedCount,
      },
      message: `${updatedCount} notificación(es) marcada(s) como leída(s)`,
      success: true,
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
