import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { PrismaClient, UserRoleEnum, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

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
    // Validate authentication and admin role
    const authResult = await AuthMiddleware.validateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check if user has admin privileges
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
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
        where: { ownerId: user.id },
        select: { id: true }
      });

      const venueIds = adminVenues.map(venue => venue.id);

      if (venueIds.length === 0) {
        // Admin has no venues, return empty result
        return NextResponse.json({
          success: true,
          data: {
            notifications: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
            summary: {
              totalNotifications: 0,
              unreadCount: 0,
              emailCount: 0,
              systemCount: 0,
            },
          },
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
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          venue: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              category: true,
              venue: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          reservation: {
            select: {
              id: true,
              confirmationId: true,
              status: true,
              checkInDate: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
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
      success: true,
      data: {
        notifications: notifications.map(notification => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          emailSent: notification.emailSent,
          emailType: notification.emailType,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
          user: notification.user,
          venue: notification.venue,
          service: notification.service,
          reservation: notification.reservation,
          metadata: notification.metadata,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        summary: {
          totalNotifications: total,
          unreadCount,
          emailCount,
          systemCount,
        },
        filters: {
          appliedFilters: filters,
          userRole: user.role,
          userId: user.id,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
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
    // Validate authentication and admin role
    const authResult = await AuthMiddleware.validateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check if user has admin privileges
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { notificationIds, isRead } = body;

    if (!Array.isArray(notificationIds) || typeof isRead !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body. Expected notificationIds array and isRead boolean' },
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
        where: { ownerId: user.id },
        select: { id: true }
      });

      const venueIds = adminVenues.map(venue => venue.id);

      if (venueIds.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No venues found for this admin' },
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
      where: whereClause,
      data: { isRead },
    });

    return NextResponse.json({
      success: true,
      data: {
        updatedCount: updateResult.count,
        isRead,
        notificationIds,
      },
    });
  } catch (error) {
    console.error('Error updating admin notifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}