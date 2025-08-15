import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { NotificationType } from '@prisma/client';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';

/**
 * GET /api/admin/notifications/stats
 * Get notification statistics for admin dashboard
 *
 * Permissions:
 * - SUPER_ADMIN: Statistics for ALL notifications
 * - ADMIN: Statistics for notifications related to their venues/services only
 *
 * Query Parameters:
 * - period: 'today', 'week', 'month', 'year' (default: 'month')
 * - startDate: Custom start date (ISO string)
 * - endDate: Custom end date (ISO string)
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

    // Validate JWT_SECRET
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
    const period = url.searchParams.get('period') || 'month';
    const customStartDate = url.searchParams.get('startDate');
    const customEndDate = url.searchParams.get('endDate');

    // Calculate date range based on period
    let startDate: Date;
    let endDate: Date = new Date();

    if (customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      const now = new Date();
      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      }
    }

    // Build base where clause with date filter
    const baseWhereClause: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Get admin venues if needed
    let adminVenues: { id: string }[] = [];

    // Role-based filtering
    if (user.role === 'ADMIN') {
      // ADMIN can only see notifications related to their venues/services
      adminVenues = await prisma.venue.findMany({
        select: { id: true },
        where: { ownerId: user.id },
      });

      const venueIds = adminVenues.map((venue) => venue.id);

      if (venueIds.length === 0) {
        // Admin has no venues, return empty statistics
        return NextResponse.json({
          data: {
            adminVenuesCount: 0,
            byDay: [],
            byType: {},
            dateRange: { endDate, startDate },
            emailTypes: {},
            overview: {
              emailNotifications: 0,
              readCount: 0,
              systemNotifications: 0,
              totalNotifications: 0,
              unreadCount: 0,
            },
            period,
            recentActivity: [],
            topUsers: [],
            userRole: user.role,
          },
          success: true,
        });
      }

      baseWhereClause.OR = [
        { venueId: { in: venueIds } },
        { service: { venueId: { in: venueIds } } },
        { reservation: { venueId: { in: venueIds } } },
      ];
    }

    // Execute parallel queries for different statistics
    const [
      totalNotifications,
      emailNotifications,
      systemNotifications,
      unreadCount,
      notificationsByType,
      recentActivity,
      topUsers,
    ] = await Promise.all([
      // Total notifications in period
      prisma.notification.count({
        where: baseWhereClause,
      }),

      // Email notifications
      prisma.notification.count({
        where: { ...baseWhereClause, emailSent: true },
      }),

      // System notifications (non-email)
      prisma.notification.count({
        where: { ...baseWhereClause, emailSent: false },
      }),

      // Unread notifications
      prisma.notification.count({
        where: { ...baseWhereClause, isRead: false },
      }),

      // Notifications by type
      prisma.notification.groupBy({
        _count: {
          type: true,
        },
        by: ['type'],
        orderBy: {
          _count: {
            type: 'desc',
          },
        },
        where: baseWhereClause,
      }),

      // Recent activity (last 10 notifications)
      prisma.notification.findMany({
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              id: true,
              lastName: true,
            },
          },
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        where: baseWhereClause,
      }),

      // Top users by notification count
      prisma.notification.groupBy({
        _count: {
          userId: true,
        },
        by: ['userId'],
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 10,
        where: baseWhereClause,
      }),
    ]);

    // Get user details for top users
    const topUserIds = topUsers.map((item) => item.userId);
    const topUsersDetails = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        role: true,
      },
      where: { id: { in: topUserIds } },
    });

    // Map user details to top users
    const enrichedTopUsers = topUsers.map((item) => {
      const userDetail = topUsersDetails.find((user) => user.id === item.userId);
      return {
        notificationCount: item._count.userId,
        user: userDetail,
        userId: item.userId,
      };
    });

    // Get daily breakdown for the period (using aggregation instead of raw SQL for safety)
    const notifications = await prisma.notification.findMany({
      select: {
        createdAt: true,
        emailSent: true,
        isRead: true,
      },
      where: baseWhereClause,
    });

    // Group by date in JavaScript
    const dailyMap = new Map<
      string,
      { date: string; count: number; emailCount: number; systemCount: number; unreadCount: number }
    >();

    notifications.forEach((notification) => {
      const date = notification.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(date) || {
        count: 0,
        date,
        emailCount: 0,
        systemCount: 0,
        unreadCount: 0,
      };

      existing.count++;
      if (notification.emailSent) existing.emailCount++;
      else existing.systemCount++;
      if (!notification.isRead) existing.unreadCount++;

      dailyMap.set(date, existing);
    });

    const dailyBreakdown = Array.from(dailyMap.values())
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);

    // Get email types breakdown
    const emailTypesBreakdown = await prisma.notification.groupBy({
      _count: {
        emailType: true,
      },
      by: ['emailType'],
      orderBy: {
        _count: {
          emailType: 'desc',
        },
      },
      where: { ...baseWhereClause, emailSent: true, emailType: { not: null } },
    });

    // Format statistics
    const byType = notificationsByType.reduce(
      (acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      },
      {} as Record<NotificationType, number>
    );

    const emailTypes = emailTypesBreakdown.reduce(
      (acc, item) => {
        if (item.emailType) {
          acc[item.emailType] = item._count.emailType;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      data: {
        adminVenuesCount: user.role === 'ADMIN' ? adminVenues?.length || 0 : null,
        byDay: dailyBreakdown,
        byType,
        dateRange: { endDate, startDate },
        emailTypes,
        overview: {
          emailNotifications,
          readCount: totalNotifications - unreadCount,
          systemNotifications,
          totalNotifications,
          unreadCount,
        },
        period,
        recentActivity: recentActivity.map((notification) => ({
          createdAt: notification.createdAt,
          emailSent: notification.emailSent,
          id: notification.id,
          isRead: notification.isRead,
          title: notification.title,
          type: notification.type,
          user: notification.user,
          venue: notification.venue,
        })),
        topUsers: enrichedTopUsers,
        userRole: user.role,
      },
      success: true,
    });
  } catch (error: any) {
    console.error('Error fetching notification statistics:', error);

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
