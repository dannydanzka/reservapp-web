import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { NotificationType, UserRoleEnum } from '@prisma/client';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';

interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationType;
  category?: 'email' | 'system';
  startDate?: string;
  endDate?: string;
  userId?: string;
  level?: 'all' | 'unread' | 'read';
}

/**
 * GET /api/admin/notifications
 * Admin endpoint to view all notifications sent via email
 *
 * Permissions:
 * - SUPER_ADMIN: Can view ALL notifications
 * - ADMIN: Can only view notifications related to their venues/services
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - isRead: Filter by read status (true/false)
 * - type: Filter by notification type
 * - category: Filter by 'email' or 'system' notifications
 * - startDate: Filter from date (ISO string)
 * - endDate: Filter to date (ISO string)
 * - userId: Filter by specific user ID
 * - level: 'all', 'unread', 'read'
 * - search: Search in title and message
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token (same pattern as /api/admin/stats)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autorización requerido', success: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { message: 'Configuración del servidor incorrecta', success: false },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, jwtSecret) as any;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado', success: false },
        { status: 401 }
      );
    }

    // Check if user has admin privileges
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { message: 'Admin access required', success: false },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    // Parse filters
    const filters: NotificationFilters = {};
    const isRead = url.searchParams.get('isRead');
    if (isRead !== null) {
      filters.isRead = isRead === 'true';
    }

    const type = url.searchParams.get('type') as NotificationType;
    if (type && Object.values(NotificationType).includes(type)) {
      filters.type = type;
    }

    const category = url.searchParams.get('category') as 'email' | 'system';
    if (category) {
      filters.category = category;
    }

    const startDate = url.searchParams.get('startDate');
    if (startDate) {
      filters.startDate = startDate;
    }

    const endDate = url.searchParams.get('endDate');
    if (endDate) {
      filters.endDate = endDate;
    }

    const userId = url.searchParams.get('userId');
    if (userId) {
      filters.userId = userId;
    }

    const level = url.searchParams.get('level') as 'all' | 'unread' | 'read';
    if (level) {
      filters.level = level;
    }

    const search = url.searchParams.get('search');

    // Build where clause based on user role and filters
    const whereClause: any = {};

    // Role-based filtering
    if (user.role === 'ADMIN') {
      // ADMIN can only see notifications related to their venues/services
      const adminVenues = await prisma.venue.findMany({
        select: { id: true },
        where: { ownerId: user.id },
      });

      const venueIds = adminVenues.map((venue) => venue.id);

      if (venueIds.length === 0) {
        // Admin has no venues, return empty result
        return NextResponse.json({
          data: {
            notifications: [],
            pagination: {
              hasNext: false,
              hasPrev: false,
              limit,
              page,
              total: 0,
              totalPages: 0,
            },
            summary: {
              emailCount: 0,
              systemCount: 0,
              totalNotifications: 0,
              unreadCount: 0,
            },
          },
          success: true,
        });
      }

      whereClause.OR = [
        { venueId: { in: venueIds } },
        { service: { venueId: { in: venueIds } } },
        { reservation: { venueId: { in: venueIds } } },
      ];
    }
    // SUPER_ADMIN sees all notifications (no additional filtering needed)

    // Apply filters
    if (filters.isRead !== undefined) {
      whereClause.isRead = filters.isRead;
    }

    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.category === 'email') {
      whereClause.emailSent = true;
    } else if (filters.category === 'system') {
      whereClause.emailSent = false;
    }

    if (filters.startDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        gte: new Date(filters.startDate),
      };
    }

    if (filters.endDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        lte: new Date(filters.endDate),
      };
    }

    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters.level === 'unread') {
      whereClause.isRead = false;
    } else if (filters.level === 'read') {
      whereClause.isRead = true;
    }

    if (search) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        { title: { contains: search } },
        { message: { contains: search } },
      ];
    }

    // Execute queries in parallel
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        include: {
          reservation: {
            select: {
              checkInDate: true,
              confirmationId: true,
              id: true,
              status: true,
            },
          },
          service: {
            select: {
              category: true,
              id: true,
              name: true,
              venue: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              email: true,
              firstName: true,
              id: true,
              lastName: true,
              role: true,
            },
          },
          venue: {
            select: {
              category: true,
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        where: whereClause,
      }),
      prisma.notification.count({ where: whereClause }),
    ]);

    // Get summary statistics
    const [unreadCount, emailCount, systemCount] = await Promise.all([
      prisma.notification.count({
        where: { ...whereClause, isRead: false },
      }),
      prisma.notification.count({
        where: { ...whereClause, emailSent: true },
      }),
      prisma.notification.count({
        where: { ...whereClause, emailSent: false },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: {
        filters: {
          appliedFilters: filters,
          userId: user.id,
          userRole: user.role,
        },
        notifications: notifications.map((notification) => ({
          createdAt: notification.createdAt,
          emailSent: notification.emailSent,
          emailType: notification.emailType,
          id: notification.id,
          isRead: notification.isRead,
          message: notification.message,
          metadata: notification.metadata,
          reservation: notification.reservation,
          service: notification.service,
          title: notification.title,
          type: notification.type,
          updatedAt: notification.updatedAt,
          user: notification.user,
          venue: notification.venue,
        })),
        pagination: {
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit,
          page,
          total,
          totalPages,
        },
        summary: {
          emailCount,
          systemCount,
          totalNotifications: total,
          unreadCount,
        },
      },
      success: true,
    });
  } catch (error: any) {
    console.error('Error fetching admin notifications:', error);

    // Handle authentication errors
    if (error.message?.includes('Token') || error.message?.includes('autorización')) {
      return NextResponse.json({ message: error.message, success: false }, { status: 401 });
    }

    return NextResponse.json(
      {
        details: error instanceof Error ? error.message : 'Unknown error',
        error: 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/notifications
 * Mark notifications as read/unread (bulk operation)
 *
 * Body:
 * {
 *   notificationIds: string[];
 *   isRead: boolean;
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get auth token (same pattern as /api/admin/stats)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autorización requerido', success: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { message: 'Configuración del servidor incorrecta', success: false },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, jwtSecret) as any;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado', success: false },
        { status: 401 }
      );
    }

    // Check if user has admin privileges
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { message: 'Admin access required', success: false },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { isRead, notificationIds } = body;

    if (!Array.isArray(notificationIds) || typeof isRead !== 'boolean') {
      return NextResponse.json(
        {
          error: 'Invalid request body. Expected notificationIds array and isRead boolean',
          success: false,
        },
        { status: 400 }
      );
    }

    // Build where clause for permission check
    const whereClause: any = {
      id: { in: notificationIds },
    };

    if (user.role === 'ADMIN') {
      // ADMIN can only update notifications related to their venues/services
      const adminVenues = await prisma.venue.findMany({
        select: { id: true },
        where: { ownerId: user.id },
      });

      const venueIds = adminVenues.map((venue) => venue.id);

      if (venueIds.length === 0) {
        return NextResponse.json(
          { error: 'No venues found for this admin', success: false },
          { status: 403 }
        );
      }

      whereClause.OR = [
        { venueId: { in: venueIds } },
        { service: { venueId: { in: venueIds } } },
        { reservation: { venueId: { in: venueIds } } },
      ];
    }

    const updateResult = await prisma.notification.updateMany({
      data: { isRead },
      where: whereClause,
    });

    return NextResponse.json({
      data: {
        isRead,
        notificationIds,
        updatedCount: updateResult.count,
      },
      success: true,
    });
  } catch (error: any) {
    console.error('Error updating admin notifications:', error);

    // Handle authentication errors
    if (error.message?.includes('Token') || error.message?.includes('autorización')) {
      return NextResponse.json({ message: error.message, success: false }, { status: 401 });
    }

    return NextResponse.json(
      {
        details: error instanceof Error ? error.message : 'Unknown error',
        error: 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
