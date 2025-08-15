import { NextRequest, NextResponse } from 'next/server';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { PaymentStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/payments
 * Get user's payment history with filtering and pagination
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 50)
 * - status: Filter by payment status
 * - startDate: Filter from date (ISO string)
 * - endDate: Filter to date (ISO string)
 * - type: Filter by payment type ('reservation', 'subscription', 'business')
 */
export async function GET(request: NextRequest) {
  try {
    // Validate authentication
    const authResult = await AuthMiddleware.validateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    // Parse filters
    const status = url.searchParams.get('status') as PaymentStatus;
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const type = url.searchParams.get('type'); // 'reservation', 'subscription', 'business'

    // Build where clause
    const whereClause: any = {
      userId: user.id,
    };

    if (status && Object.values(PaymentStatus).includes(status)) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Filter by payment type based on metadata or relationships
    if (type === 'reservation') {
      whereClause.reservation = { isNot: null };
    } else if (type === 'subscription') {
      whereClause.subscription = { isNot: null };
    } else if (type === 'business') {
      whereClause.AND = [{ reservation: null }, { subscription: null }];
    }

    // Execute queries in parallel
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        include: {
          receipt: {
            select: {
              id: true,
              issueDate: true,
              pdfUrl: true,
              receiptNumber: true,
              status: true,
              subtotalAmount: true,
              taxAmount: true,
              type: true,
            },
          },
          reservation: {
            select: {
              checkInDate: true,
              checkOutDate: true,
              confirmationId: true,
              guests: true,
              id: true,
              service: {
                select: {
                  category: true,
                  id: true,
                  name: true,
                },
              },
              status: true,
              venue: {
                select: {
                  category: true,
                  city: true,
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        where: whereClause,
      }),
      prisma.payment.count({ where: whereClause }),
    ]);

    // Get summary statistics
    const [totalAmount, completedAmount, pendingCount] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { userId: user.id },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.COMPLETED, userId: user.id },
      }),
      prisma.payment.count({
        where: { status: PaymentStatus.PENDING, userId: user.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Format response
    const formattedPayments = payments.map((payment) => ({
      amount: Number(payment.amount),
      createdAt: payment.createdAt,
      currency: payment.currency,
      description: payment.description,
      id: payment.id,
      metadata: payment.metadata,

      paymentMethod: payment.paymentMethod,

      // Related data
      reservation: payment.reservation,

      status: payment.status,

      // Stripe data (if available)
      stripePaymentId: payment.stripePaymentId,

      transactionDate: payment.transactionDate,

      // Payment type classification
      type: payment.reservation
        ? 'reservation'
        : (payment.metadata as any)?.paymentType === 'subscription'
          ? 'subscription'
          : 'business',
      updatedAt: payment.updatedAt,
    }));

    return NextResponse.json({
      data: {
        pagination: {
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit,
          page,
          total,
          totalPages,
        },
        payments: formattedPayments,
        summary: {
          completedAmount: Number(completedAmount._sum.amount || 0),
          pendingCount,
          totalAmount: Number(totalAmount._sum.amount || 0),
          totalPayments: total,
        },
      },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
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
 * POST /api/payments
 * Create a new payment (for manual payments or special cases)
 *
 * Body:
 * {
 *   amount: number;
 *   currency?: string;
 *   description?: string;
 *   paymentMethod?: string;
 *   reservationId?: string;
 *   subscriptionId?: string;
 *   metadata?: object;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    const authResult = await AuthMiddleware.validateRequest(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required', success: false },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const body = await request.json();

    const {
      amount,
      currency = 'MXN',
      description,
      metadata,
      paymentMethod,
      reservationId,
      subscriptionId,
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required', success: false },
        { status: 400 }
      );
    }

    // Validate relationships if provided
    if (reservationId) {
      const reservation = await prisma.reservation.findFirst({
        where: { id: reservationId, userId: user.id },
      });
      if (!reservation) {
        return NextResponse.json(
          { error: 'Reservation not found or not owned by user', success: false },
          { status: 404 }
        );
      }
    }

    if (subscriptionId) {
      const subscription = await prisma.subscription.findFirst({
        where: { id: subscriptionId, userId: user.id },
      });
      if (!subscription) {
        return NextResponse.json(
          { error: 'Subscription not found or not owned by user', success: false },
          { status: 404 }
        );
      }
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        currency: currency.toUpperCase(),
        description,
        metadata: metadata || null,
        paymentMethod,
        reservationId,
        status: PaymentStatus.PENDING,
        transactionDate: new Date(),
        userId: user.id,
      },
      include: {
        reservation: {
          select: {
            confirmationId: true,
            id: true,
            service: { select: { name: true } },
            venue: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json({
      data: {
        amount: Number(payment.amount),
        createdAt: payment.createdAt,
        currency: payment.currency,
        description: payment.description,
        id: payment.id,
        reservation: payment.reservation,
        status: payment.status,
      },
      message: 'Payment created successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
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
