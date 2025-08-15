import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { PrismaClient, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

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
        where: { ownerId: user.id },
        select: { id: true }
      });

      const venueIds = adminVenues.map(venue => venue.id);

      if (venueIds.length === 0) {
        // Admin has no venues, return empty statistics
        return NextResponse.json({
          success: true,
          data: {
            period,
            dateRange: { startDate, endDate },
            overview: {
              totalNotifications: 0,
              emailNotifications: 0,
              systemNotifications: 0,
              unreadCount: 0,
              readCount: 0,
            },
            byType: {},
            byDay: [],
            topUsers: [],
            recentActivity: [],
            emailTypes: {},
            userRole: user.role,
            adminVenuesCount: 0,
          },
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
        by: ['type'],
        where: baseWhereClause,
        _count: {
          type: true,
        },
        orderBy: {
          _count: {
            type: 'desc',
          },
        },
      }),

      // Recent activity (last 10 notifications)
      prisma.notification.findMany({
        where: baseWhereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
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
      }),

      // Top users by notification count
      prisma.notification.groupBy({
        by: ['userId'],
        where: baseWhereClause,
        _count: {
          userId: true,
        },
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // Get user details for top users
    const topUserIds = topUsers.map(item => item.userId);
    const topUsersDetails = await prisma.user.findMany({
      where: { id: { in: topUserIds } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // Map user details to top users
    const enrichedTopUsers = topUsers.map(item => {
      const userDetail = topUsersDetails.find(user => user.id === item.userId);
      return {
        userId: item.userId,
        notificationCount: item._count.userId,
        user: userDetail,
      };
    });

    // Get daily breakdown for the period (using aggregation instead of raw SQL for safety)
    const notifications = await prisma.notification.findMany({
      where: baseWhereClause,
      select: {
        createdAt: true,
        emailSent: true,
        isRead: true,
      },
    });

    // Group by date in JavaScript
    const dailyMap = new Map<string, { date: string; count: number; emailCount: number; systemCount: number; unreadCount: number }>();
    
    notifications.forEach(notification => {
      const date = notification.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(date) || { date, count: 0, emailCount: 0, systemCount: 0, unreadCount: 0 };
      
      existing.count++;
      if (notification.emailSent) existing.emailCount++;
      else existing.systemCount++;
      if (!notification.isRead) existing.unreadCount++;
      
      dailyMap.set(date, existing);
    });
    
    const dailyBreakdown = Array.from(dailyMap.values()).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

    // Get email types breakdown
    const emailTypesBreakdown = await prisma.notification.groupBy({
      by: ['emailType'],
      where: { ...baseWhereClause, emailSent: true, emailType: { not: null } },
      _count: {
        emailType: true,
      },
      orderBy: {
        _count: {
          emailType: 'desc',
        },
      },
    });

    // Format statistics
    const byType = notificationsByType.reduce((acc, item) => {
      acc[item.type] = item._count.type;
      return acc;
    }, {} as Record<NotificationType, number>);

    const emailTypes = emailTypesBreakdown.reduce((acc, item) => {
      if (item.emailType) {
        acc[item.emailType] = item._count.emailType;
      }
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        overview: {
          totalNotifications,
          emailNotifications,
          systemNotifications,
          unreadCount,
          readCount: totalNotifications - unreadCount,
        },
        byType,
        byDay: dailyBreakdown,
        topUsers: enrichedTopUsers,
        recentActivity: recentActivity.map(notification => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          isRead: notification.isRead,
          emailSent: notification.emailSent,
          createdAt: notification.createdAt,
          user: notification.user,
          venue: notification.venue,
        })),
        emailTypes,
        userRole: user.role,
        adminVenuesCount: user.role === 'ADMIN' ? adminVenues?.length || 0 : null,
      },
    });
  } catch (error) {
    console.error('Error fetching notification statistics:', error);
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