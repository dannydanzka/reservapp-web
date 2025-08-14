import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { prisma } from '@libs/infrastructure/services/core/database/prismaService';

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

    // Check permissions - Only SUPER_ADMIN and ADMIN can access stats
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { message: 'No autorizado - Solo administradores pueden ver estadísticas', success: false },
        { status: 403 }
      );
    }

    const isSuperAdmin = user.role === 'SUPER_ADMIN';

    // Get base query conditions based on user role
    // SUPER_ADMIN sees everything, ADMIN sees only their venues
    const venueCondition = isSuperAdmin ? {} : { ownerId: user.id };
    const reservationCondition = isSuperAdmin
      ? {}
      : {
          venue: {
            ownerId: user.id,
          },
        };

    // Get current date for monthly calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get data for last 6 months for charts
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    // Get total reservations count
    const totalReservations = await prisma.reservation.count({
      where: reservationCondition,
    });

    // Get active venues count
    const activeVenues = await prisma.venue.count({
      where: {
        ...venueCondition,
        isActive: true,
      },
    });

    // Get monthly revenue
    const monthlyPayments = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: 'COMPLETED',
        ...(isSuperAdmin
          ? {}
          : {
              reservation: {
                venue: {
                  ownerId: user.id,
                },
              },
            }),
      },
    });

    const monthlyRevenue = monthlyPayments._sum.amount || 0;

    // Get total registered users
    // SUPER_ADMIN sees all users, ADMIN sees unique users who have made reservations at their venues
    const totalUsers = isSuperAdmin
      ? await prisma.user.count({
          where: {
            role: 'USER',
          },
        })
      : await prisma.reservation
          .groupBy({
            _count: true,
            by: ['userId'],
            where: reservationCondition,
          })
          .then((groups) => groups.length);

    // Get recent reservations
    const recentReservations = await prisma.reservation.findMany({
      include: {
        service: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        venue: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      where: reservationCondition,
    });

    // Get popular venues
    const popularVenues = await prisma.venue.findMany({
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
      },
      orderBy: {
        reservations: {
          _count: 'desc',
        },
      },
      take: 5,
      where: {
        ...venueCondition,
        isActive: true,
      },
    });

    // Generate revenue chart data (last 6 months)
    const revenueChartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(now.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date();
      monthEnd.setMonth(now.getMonth() - i + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      const monthRevenue = await prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
          status: 'COMPLETED',
          ...(isSuperAdmin
            ? {}
            : {
                reservation: {
                  venue: {
                    ownerId: user.id,
                  },
                },
              }),
        },
      });

      const monthNames = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ];
      revenueChartData.push({
        month: monthNames[monthStart.getMonth()],
        revenue: Number(monthRevenue._sum.amount || 0),
      });
    }

    // Generate reservations chart data (last 6 months)
    const reservationsChartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(now.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date();
      monthEnd.setMonth(now.getMonth() - i + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      // Get total reservations for this month
      const monthReservations = await prisma.reservation.count({
        where: {
          ...reservationCondition,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      // Get reservations by status for this month
      const [confirmed, pending, cancelled] = await Promise.all([
        prisma.reservation.count({
          where: {
            ...reservationCondition,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
            status: 'CONFIRMED',
          },
        }),
        prisma.reservation.count({
          where: {
            ...reservationCondition,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
            status: 'PENDING',
          },
        }),
        prisma.reservation.count({
          where: {
            ...reservationCondition,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
            status: 'CANCELLED',
          },
        }),
      ]);

      const monthNames = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ];
      reservationsChartData.push({
        cancelled,
        confirmed,
        month: monthNames[monthStart.getMonth()],
        pending,
        reservations: monthReservations,
      });
    }

    // Format response
    const stats = {
      activeVenues,
      monthlyRevenue: Number(monthlyRevenue),
      popularVenues: popularVenues.map((v) => ({
        category: v.category,
        id: v.id,
        name: v.name,
        rating: Number(v.rating || 0),
        reservationsCount: v._count.reservations,
      })),
      recentReservations: recentReservations.map((r) => ({
        createdAt: r.createdAt.toISOString(),
        date: r.checkInDate.toISOString(),
        id: r.id,
        serviceName: r.service?.name || 'Sin servicio',
        status: r.status.toLowerCase(),
        time: '00:00',
        totalAmount: Number(r.totalAmount),
        userEmail: r.user.email,
        userName: `${r.user.firstName} ${r.user.lastName}`,
        venueName: r.venue.name,
      })),
      reservationsChartData,
      revenueChartData,
      totalReservations,
      totalUsers,
    };

    return NextResponse.json({
      data: stats,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error al obtener estadísticas',
        success: false,
      },
      { status: 500 }
    );
  }
}
