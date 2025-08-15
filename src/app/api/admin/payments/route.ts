import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

import { PaymentStatus, PrismaClient, UserRoleEnum } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

/**
 * Get payments with comprehensive admin information
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autorización requerido', success: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    // Check admin privileges
    if (!['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return NextResponse.json(
        { message: 'Acceso denegado. Se requieren privilegios de administrador', success: false },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const venueId = searchParams.get('venueId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');

    // Build where clause with filters
    const where: any = {};

    // Role-based filtering for payments
    if (decoded.role === 'ADMIN') {
      // ADMIN can only see payments related to their venues/services
      const adminVenues = await prisma.venue.findMany({
        select: { id: true },
        where: { ownerId: decoded.userId },
      });

      const venueIds = adminVenues.map((venue) => venue.id);

      if (venueIds.length === 0) {
        // Admin has no venues, return empty result
        return NextResponse.json({
          data: [],
          pagination: {
            hasMore: false,
            limit,
            page,
            total: 0,
            totalPages: 0,
          },
          success: true,
        });
      }

      where.reservation = {
        venueId: { in: venueIds },
      };
    }
    // SUPER_ADMIN sees all payments (no additional filtering needed)

    if (status && status !== 'ALL') {
      where.status = status as PaymentStatus;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (venueId) {
      if (decoded.role === 'ADMIN') {
        // Ensure ADMIN can only filter by their own venues
        const adminVenues = await prisma.venue.findMany({
          select: { id: true },
          where: { ownerId: decoded.userId },
        });
        const venueIds = adminVenues.map((venue) => venue.id);

        if (venueIds.includes(venueId)) {
          where.reservation = {
            venueId: venueId,
          };
        } else {
          return NextResponse.json(
            {
              message: 'No tienes permisos para ver pagos de este venue',
              success: false,
            },
            { status: 403 }
          );
        }
      } else {
        where.reservation = {
          venueId: venueId,
        };
      }
    }

    if (search) {
      where.OR = [
        { user: { email: { contains: search } } },
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
        { id: { contains: search } },
        { stripePaymentId: { contains: search } },
      ];
    }

    // Get payments with comprehensive relations
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        include: {
          receipt: {
            select: {
              id: true,
              isVerified: true,
              pdfUrl: true,
              receiptNumber: true,
              status: true,
            },
          },
          reservation: {
            include: {
              service: {
                select: {
                  category: true,
                  id: true,
                  name: true,
                },
              },
              venue: {
                select: {
                  category: true,
                  id: true,
                  name: true,
                  owner: {
                    select: {
                      businessAccount: {
                        select: {
                          businessName: true,
                          businessType: true,
                        },
                      },
                      email: true,
                      firstName: true,
                      id: true,
                      lastName: true,
                    },
                  },
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
              stripeCustomerId: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.payment.count({ where }),
    ]);

    // Enhance payment data with Stripe information
    const enhancedPayments = await Promise.all(
      payments.map(async (payment) => {
        let stripePaymentInfo = null;
        let stripeCustomerInfo = null;

        // Fetch Stripe payment details if available
        if (payment.stripePaymentId) {
          try {
            const stripePayment = await stripe.paymentIntents.retrieve(payment.stripePaymentId, {
              expand: ['charges.data.balance_transaction'],
            });
            stripePaymentInfo = {
              amount: stripePayment.amount,
              charges: stripePayment.latest_charge ? [stripePayment.latest_charge] : [],
              created: new Date(stripePayment.created * 1000),
              currency: stripePayment.currency,
              fees: null,
              id: stripePayment.id,
              paymentMethod: stripePayment.payment_method,
              status: stripePayment.status, // Will be handled separately if needed
            };
          } catch (stripeError) {
            console.warn(`Failed to fetch Stripe payment ${payment.stripePaymentId}:`, stripeError);
          }
        }

        // Fetch Stripe customer details if available
        if (payment.user.stripeCustomerId) {
          try {
            const stripeCustomer = await stripe.customers.retrieve(payment.user.stripeCustomerId);
            if (stripeCustomer && !('deleted' in stripeCustomer)) {
              stripeCustomerInfo = {
                defaultSource: stripeCustomer.default_source,
                email: stripeCustomer.email,
                id: stripeCustomer.id,
                name: stripeCustomer.name,
              };
            }
          } catch (stripeError) {
            console.warn(
              `Failed to fetch Stripe customer ${payment.user.stripeCustomerId}:`,
              stripeError
            );
          }
        }

        // Calculate platform commission (assuming 5% for now)
        const platformCommissionRate = 0.05;
        const grossAmount = Number(payment.amount);
        const platformFee = grossAmount * platformCommissionRate;
        const netAmount = grossAmount - platformFee;

        return {
          amount: Number(payment.amount),

          // Business and venue information
          business: payment.reservation.venue.owner
            ? {
                email: payment.reservation.venue.owner.email,
                id: payment.reservation.venue.owner.id,
                name:
                  payment.reservation.venue.owner.businessAccount?.businessName ||
                  `${payment.reservation.venue.owner.firstName} ${payment.reservation.venue.owner.lastName}`,
                ownerName: `${payment.reservation.venue.owner.firstName} ${payment.reservation.venue.owner.lastName}`,
                type: payment.reservation.venue.owner.businessAccount?.businessType || 'OTHER',
              }
            : null,

          createdAt: payment.createdAt,

          currency: payment.currency,

          description: payment.description,

          // Payment basic info
          id: payment.id,

          metadata: payment.metadata,

          netAmount,

          paymentMethod: payment.paymentMethod,

          platformCommissionRate,

          // Enhanced payment calculations
          platformFee,

          // Receipt information
          receipt: payment.receipt,

          // Reservation information
          reservation: {
            checkInDate: payment.reservation.checkInDate,
            checkOutDate: payment.reservation.checkOutDate,
            guests: payment.reservation.guests,
            id: payment.reservation.id,
            status: payment.reservation.status,
          },

          service: {
            category: payment.reservation.service.category,
            id: payment.reservation.service.id,
            name: payment.reservation.service.name,
          },

          status: payment.status,

          stripeCustomer: stripeCustomerInfo,

          // Stripe enhanced data
          stripeData: stripePaymentInfo,

          stripePaymentId: payment.stripePaymentId,

          transactionDate: payment.transactionDate,

          updatedAt: payment.updatedAt,

          // Customer information
          user: {
            email: payment.user.email,
            firstName: payment.user.firstName,
            fullName: `${payment.user.firstName} ${payment.user.lastName}`,
            id: payment.user.id,
            lastName: payment.user.lastName,
            stripeCustomerId: payment.user.stripeCustomerId,
          },

          venue: {
            category: payment.reservation.venue.category,
            id: payment.reservation.venue.id,
            name: payment.reservation.venue.name,
          },
        };
      })
    );

    return NextResponse.json({
      data: enhancedPayments,
      pagination: {
        hasMore: page * limit < total,
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error('Get admin payments error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Get payment statistics for admin dashboard
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token de autorización requerido', success: false },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    // Check admin privileges for statistics
    if (!['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return NextResponse.json(
        {
          message: 'Acceso denegado. Se requieren privilegios de administrador',
          success: false,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, filters } = body;

    if (action === 'getStats') {
      // Build date filters
      const dateFilter =
        filters?.startDate && filters?.endDate
          ? {
              createdAt: {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate),
              },
            }
          : {};

      // Role-based filtering for statistics
      let roleFilter = {};
      if (decoded.role === 'ADMIN') {
        // ADMIN can only see stats for their venues
        const adminVenues = await prisma.venue.findMany({
          select: { id: true },
          where: { ownerId: decoded.userId },
        });

        const venueIds = adminVenues.map((venue) => venue.id);

        if (venueIds.length === 0) {
          // Admin has no venues, return zero stats
          return NextResponse.json({
            data: {
              averageTransaction: 0,
              completedAmount: 0,
              completedTransactions: 0,
              failedAmount: 0,
              failedTransactions: 0,
              failureRate: 0,
              monthlyGrowth: 0,
              pendingAmount: 0,
              pendingTransactions: 0,
              platformCommissionRate: 0.05,
              refundRate: 0,
              refundedAmount: 0,
              refundedTransactions: 0,
              successRate: 0,
              totalNetRevenue: 0,
              totalPlatformFees: 0,
              totalRevenue: 0,
              totalTransactions: 0,
            },
            success: true,
          });
        }

        roleFilter = {
          reservation: {
            venueId: { in: venueIds },
          },
        };
      }
      // SUPER_ADMIN sees all stats (no additional filtering needed)

      // Get comprehensive statistics
      const [
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        revenueStats,
        previousPeriodRevenue,
      ] = await Promise.all([
        // Total payments count
        prisma.payment.count({ where: { ...dateFilter, ...roleFilter } }),

        // Completed payments
        prisma.payment.aggregate({
          _count: true,
          _sum: { amount: true },
          where: { ...dateFilter, ...roleFilter, status: PaymentStatus.COMPLETED },
        }),

        // Pending payments
        prisma.payment.aggregate({
          _count: true,
          _sum: { amount: true },
          where: { ...dateFilter, ...roleFilter, status: PaymentStatus.PENDING },
        }),

        // Failed payments
        prisma.payment.aggregate({
          _count: true,
          _sum: { amount: true },
          where: { ...dateFilter, ...roleFilter, status: PaymentStatus.FAILED },
        }),

        // Refunded payments
        prisma.payment.aggregate({
          _count: true,
          _sum: { amount: true },
          where: { ...dateFilter, ...roleFilter, status: PaymentStatus.REFUNDED },
        }),

        // Overall revenue stats
        prisma.payment.aggregate({
          _avg: { amount: true },
          _count: true,
          _sum: { amount: true },
          where: { ...dateFilter, ...roleFilter, status: PaymentStatus.COMPLETED },
        }),

        // Previous period revenue for growth calculation (if date filters provided)
        filters?.startDate && filters?.endDate
          ? prisma.payment.aggregate({
              _sum: { amount: true },
              where: {
                ...roleFilter,
                createdAt: {
                  gte: new Date(
                    new Date(filters.startDate).getTime() -
                      (new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime())
                  ),
                  lt: new Date(filters.startDate),
                },
                status: PaymentStatus.COMPLETED,
              },
            })
          : null,
      ]);

      // Calculate statistics
      const totalRevenue = Number(revenueStats._sum.amount || 0);
      const averageTransaction = Number(revenueStats._avg.amount || 0);
      const platformCommissionRate = 0.05;
      const totalPlatformFees = totalRevenue * platformCommissionRate;
      const totalNetRevenue = totalRevenue - totalPlatformFees;

      // Calculate growth rate
      const previousRevenue = Number(previousPeriodRevenue?._sum.amount || 0);
      const growthRate =
        previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      const stats = {
        averageTransaction,

        // Transaction amounts by status
        completedAmount: Number(completedPayments._sum.amount || 0),

        completedTransactions: completedPayments._count,

        failedAmount: Number(failedPayments._sum.amount || 0),

        failedTransactions: failedPayments._count,

        failureRate: totalPayments > 0 ? (failedPayments._count / totalPayments) * 100 : 0,

        monthlyGrowth: growthRate,

        pendingAmount: Number(pendingPayments._sum.amount || 0),

        pendingTransactions: pendingPayments._count,

        // Commission info
        platformCommissionRate,

        refundRate: totalPayments > 0 ? (refundedPayments._count / totalPayments) * 100 : 0,

        refundedAmount: Number(refundedPayments._sum.amount || 0),

        refundedTransactions: refundedPayments._count,

        // Rates
        successRate: totalPayments > 0 ? (completedPayments._count / totalPayments) * 100 : 0,

        totalNetRevenue,

        totalPlatformFees,

        // Revenue metrics
        totalRevenue,

        // Transaction counts
        totalTransactions: totalPayments,
      };

      return NextResponse.json({
        data: stats,
        success: true,
      });
    }

    return NextResponse.json({ message: 'Acción no válida', success: false }, { status: 400 });
  } catch (error) {
    console.error('Payment stats error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
