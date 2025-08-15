import { NextRequest, NextResponse } from 'next/server';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';
import { ReservationStatus } from '@prisma/client';

export const GET = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    const userId = user.id;

    // Get user's reservations statistics
    const reservationsStats = await prisma.reservation.groupBy({
      _count: {
        id: true,
      },
      by: ['status'],
      where: {
        userId: userId,
      },
    });

    // Calculate reservation statistics
    const totalReservations = reservationsStats.reduce((sum, stat) => sum + stat._count.id, 0);

    const completedReservations = reservationsStats
      .filter((stat) => stat.status === ReservationStatus.COMPLETED)
      .reduce((sum, stat) => sum + stat._count.id, 0);

    // Get upcoming reservations (confirmed or in progress)
    const upcomingReservations = reservationsStats
      .filter(
        (stat) =>
          stat.status === ReservationStatus.CONFIRMED ||
          stat.status === ReservationStatus.IN_PROGRESS ||
          stat.status === ReservationStatus.CHECKED_IN
      )
      .reduce((sum, stat) => sum + stat._count.id, 0);

    // Get recent reservations with details
    const recentReservations = await prisma.reservation.findMany({
      include: {
        service: {
          select: {
            category: true,
            currency: true,
            id: true,
            name: true,
            price: true,
          },
        },
        venue: {
          select: {
            address: true,
            category: true,
            city: true,
            id: true,
            name: true,
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      where: {
        userId: userId,
      },
    });

    // Get next upcoming reservation
    const nextReservation = await prisma.reservation.findFirst({
      include: {
        service: {
          select: {
            category: true,
            currency: true,
            id: true,
            name: true,
            price: true,
          },
        },
        venue: {
          select: {
            address: true,
            category: true,
            city: true,
            id: true,
            name: true,
            rating: true,
          },
        },
      },
      orderBy: {
        checkInDate: 'asc',
      },
      where: {
        checkInDate: {
          gte: new Date(),
        },
        status: {
          in: [
            ReservationStatus.CONFIRMED,
            ReservationStatus.IN_PROGRESS,
            ReservationStatus.CHECKED_IN,
          ],
        },
        userId: userId,
      },
    });

    // Get user's favorite venues
    const favoriteVenues = await prisma.favorite.findMany({
      include: {
        venue: {
          include: {
            _count: {
              select: {
                reviews: true,
                services: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      where: {
        userId: userId,
      },
    });

    // Get total spent amount
    const totalSpent = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'COMPLETED',
        userId: userId,
      },
    });

    // Get user notifications count
    const unreadNotifications = await prisma.notification.count({
      where: {
        isRead: false,
        userId: userId,
      },
    });

    // Get user details from database
    const userDetails = await prisma.user.findUnique({
      select: {
        email: true,
        firstName: true,
        id: true,
        isPremium: true,
        lastName: true,
      },
      where: { id: userId },
    });

    // Prepare dashboard data
    const dashboardData = {
      favoriteVenues: favoriteVenues.map((fav) => ({
        address: fav.venue.address,
        category: fav.venue.category,
        city: fav.venue.city,
        favoritedAt: fav.createdAt,
        id: fav.venue.id,
        name: fav.venue.name,
        rating: fav.venue.rating,
        reviewsCount: fav.venue._count.reviews,
        servicesCount: fav.venue._count.services,
      })),
      nextReservation,
      recentReservations,
      statistics: {
        completedReservations,
        favoriteVenues: favoriteVenues.length,
        totalReservations,
        totalSpent: totalSpent._sum.amount || 0,
        unreadNotifications,
        upcomingReservations,
      },
      user: userDetails,
    };

    return {
      data: dashboardData,
      success: true,
    };
  } catch (error) {
    console.error('Error fetching mobile dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
});
