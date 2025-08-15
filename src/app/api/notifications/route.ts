import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { PrismaClient, NotificationType } from '@prisma/client';

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
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          isRead: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.notification.count({ where }),
    ]);

    // Get unread count for the user
    const unreadCount = await prisma.notification.count({
      where: {
        userId: decoded.userId,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notificaciones obtenidas exitosamente',
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      meta: {
        unreadCount,
      },
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
    const {
      userId,
      type,
      title,
      message,
      metadata,
    } = body;

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
          success: false 
        },
        { status: 400 }
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true },
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
        userId,
        type,
        title,
        message,
        metadata: metadata || null,
      },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        isRead: true,
        metadata: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notificación creada exitosamente',
      data: notification,
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
    const { notificationIds, markAllAsRead } = body;

    let updatedCount = 0;

    if (markAllAsRead === true) {
      // Mark all unread notifications as read for the user
      const result = await prisma.notification.updateMany({
        where: {
          userId: decoded.userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
      updatedCount = result.count;
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      const result = await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: decoded.userId, // Ensure user can only mark their own notifications
        },
        data: {
          isRead: true,
        },
      });
      updatedCount = result.count;
    } else {
      return NextResponse.json(
        { message: 'Se requiere notificationIds (array) o markAllAsRead (boolean)', success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount} notificación(es) marcada(s) como leída(s)`,
      data: {
        updatedCount,
      },
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
