import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

import { PaymentStatus, PrismaClient, ReservationStatus } from '@prisma/client';
import { ResendService } from '@libs/infrastructure/services/core/email/resendService';

const prisma = new PrismaClient();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

/**
 * Get reservations
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Build where clause based on role
    const where: any = {};
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      where.userId = decoded.userId;
    }
    if (status) {
      where.status = status;
    }

    // Build include clause based on user role
    const includeOwner = decoded.role === 'SUPER_ADMIN';

    // Get reservations
    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        include: {
          service: {
            select: { id: true, name: true, price: true },
          },
          user: {
            select: { email: true, firstName: true, id: true, lastName: true },
          },
          venue: {
            select: {
              id: true,
              name: true,
              // Include owner information for SUPER_ADMIN only
              ...(includeOwner && {
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
              }),
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      prisma.reservation.count({ where }),
    ]);

    return NextResponse.json({
      data: reservations,
      meta: {
        includesOwnerInfo: includeOwner,
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
    console.error('Get reservations error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create reservation with Stripe payment processing
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
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      contactPhone,
      emergencyContact,
      guests = 1,
      notes,
      paymentInfo,
      serviceId,
      specialRequests,
      venueId, // { method: 'STRIPE', paymentMethodId: 'pm_xxx' }
    } = body;

    // Validate required fields
    if (!venueId || !serviceId || !checkInDate || !checkOutDate) {
      return NextResponse.json(
        { message: 'Venue, servicio, fecha de entrada y salida son requeridos', success: false },
        { status: 400 }
      );
    }

    // Validate payment info
    if (!paymentInfo?.paymentMethodId) {
      return NextResponse.json(
        { message: 'Información de pago requerida (paymentMethodId)', success: false },
        { status: 400 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      select: {
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        phone: true,
        stripeCustomerId: true,
      },
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado', success: false },
        { status: 404 }
      );
    }

    // Get service details to calculate amount
    const service = await prisma.service.findUnique({
      select: { category: true, id: true, name: true, price: true },
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Servicio no encontrado', success: false },
        { status: 404 }
      );
    }

    // Get venue details
    const venue = await prisma.venue.findUnique({
      select: { address: true, city: true, id: true, name: true },
      where: { id: venueId },
    });

    if (!venue) {
      return NextResponse.json({ message: 'Venue no encontrado', success: false }, { status: 404 });
    }

    // Calculate total amount
    const totalAmount = Number(service.price);
    const amountInCents = Math.round(totalAmount * 100); // Stripe uses cents

    // Create or get Stripe customer
    let { stripeCustomerId } = user;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || contactPhone || undefined,
      });

      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        data: { stripeCustomerId },
        where: { id: user.id },
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      confirm: true,
      currency: 'mxn',
      customer: stripeCustomerId,

      description: `Reserva en ${venue.name} - ${service.name}`,

      // Required for some payment methods
      metadata: {
        reservationType: 'booking',
        serviceId: service.id,
        userId: user.id,
        venueId: venue.id,
      },

      payment_method: paymentInfo.paymentMethodId,
      // Automatically confirm the payment
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://reservapp-web.vercel.app'}/reservations`,
    });

    // Create reservation in database
    const reservation = await prisma.reservation.create({
      data: {
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        confirmationId: `RES${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        guests: Number(guests),
        notes: notes || specialRequests,
        serviceId,
        status:
          paymentIntent.status === 'succeeded'
            ? ReservationStatus.CONFIRMED
            : ReservationStatus.PENDING,
        totalAmount,
        userId: decoded.userId,
        venueId,
      },
      include: {
        service: {
          select: { category: true, id: true, name: true, price: true },
        },
        user: {
          select: { email: true, firstName: true, id: true, lastName: true },
        },
        venue: {
          select: { address: true, city: true, id: true, name: true },
        },
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: totalAmount,
        currency: 'MXN',
        description: `Pago por reserva ${reservation.confirmationId}`,
        metadata: {
          paymentIntentId: paymentIntent.id,
          paymentMethodId: paymentInfo.paymentMethodId,
          stripeCustomerId,
        },
        paymentMethod: paymentInfo.method || 'STRIPE',
        reservationId: reservation.id,
        status:
          paymentIntent.status === 'succeeded' ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
        stripePaymentId: paymentIntent.id,
        transactionDate: paymentIntent.status === 'succeeded' ? new Date() : null,
        userId: user.id,
      },
    });

    // Create notification for successful reservation
    if (paymentIntent.status === 'succeeded') {
      try {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'RESERVATION_CONFIRMATION',
            title: '🎉 ¡Reserva confirmada!',
            message: `Tu reserva en ${venue.name} para ${service.name} ha sido confirmada. Código de confirmación: ${reservation.confirmationId}`,
            metadata: {
              reservationId: reservation.id,
              confirmationId: reservation.confirmationId,
              venueName: venue.name,
              serviceName: service.name,
              checkInDate: reservation.checkInDate.toISOString(),
              totalAmount: totalAmount,
            },
          },
        });
      } catch (notificationError) {
        console.error('Error creating reservation notification:', notificationError);
        // Don't fail the reservation if notification creation fails
      }

      try {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'PAYMENT_CONFIRMATION',
            title: '💳 Pago procesado exitosamente',
            message: `Tu pago de ${totalAmount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} ha sido procesado para la reserva ${reservation.confirmationId}`,
            metadata: {
              paymentId: payment.id,
              stripePaymentId: payment.stripePaymentId,
              amount: totalAmount,
              reservationId: reservation.id,
              confirmationId: reservation.confirmationId,
            },
          },
        });
      } catch (notificationError) {
        console.error('Error creating payment notification:', notificationError);
        // Don't fail the reservation if notification creation fails
      }
    }

    // Send confirmation email only if payment succeeded
    if (paymentIntent.status === 'succeeded') {
      try {
        const fullName = `${reservation.user.firstName} ${reservation.user.lastName}`;

        await ResendService.sendReservationConfirmation({
          checkInDate: reservation.checkInDate.toLocaleDateString('es-MX'),
          checkOutDate: reservation.checkOutDate.toLocaleDateString('es-MX'),
          confirmationCode: reservation.confirmationId,
          currency: 'MXN',
          guestEmail: reservation.user.email,
          guestName: fullName,
          reservationId: reservation.confirmationId,
          serviceName: reservation.service.name,
          serviceNumber: reservation.service.id,
          specialRequests: reservation.notes || undefined,
          totalAmount: Number(reservation.totalAmount),
          userId: reservation.userId,
          venueName: reservation.venue.name,
        });

        console.log(`Email de confirmación enviado para reserva ${reservation.confirmationId}`);
      } catch (emailError) {
        console.error('Error enviando email de confirmación:', emailError);
        // Don't fail the reservation if email fails
      }

      // Send payment confirmation email
      try {
        const fullName = `${reservation.user.firstName} ${reservation.user.lastName}`;

        await ResendService.sendPaymentConfirmation({
          currency: payment.currency,
          guestEmail: reservation.user.email,
          guestName: fullName,
          paymentAmount: Number(payment.amount),
          paymentDate: new Date().toLocaleDateString('es-MX'),
          paymentMethod: payment.paymentMethod || 'Tarjeta de Crédito',
          reservationId: reservation.confirmationId,
          transactionId: payment.stripePaymentId || payment.id,
          userId: reservation.userId,
        });

        console.log(
          `Email de confirmación de pago enviado para reserva ${reservation.confirmationId}`
        );
      } catch (emailError) {
        console.error('Error enviando email de confirmación de pago:', emailError);
        // Don't fail the reservation if email fails
      }
    }

    return NextResponse.json({
      data: {
        payment: {
          amount: payment.amount,
          currency: payment.currency,
          id: payment.id,
          paymentMethod: payment.paymentMethod,
          status: payment.status,
          stripePaymentId: payment.stripePaymentId,
        },
        reservation: {
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          confirmationId: reservation.confirmationId,
          guests: reservation.guests,
          id: reservation.id,
          service: reservation.service,
          status: reservation.status,
          totalAmount: reservation.totalAmount,
          user: reservation.user,
          venue: reservation.venue,
        },
        stripePaymentIntent: {
          amount: paymentIntent.amount,
          client_secret: paymentIntent.client_secret,
          currency: paymentIntent.currency,
          id: paymentIntent.id,
          status: paymentIntent.status,
        },
      },
      message:
        paymentIntent.status === 'succeeded'
          ? 'Reserva creada y pago procesado exitosamente'
          : 'Reserva creada, procesando pago',
      success: true,
    });
  } catch (error) {
    console.error('Create reservation error:', error);

    // Handle Stripe errors specifically
    if (error instanceof Stripe.errors.StripeError) {
      let errorMessage = 'Error procesando el pago';

      switch (error.code) {
        case 'card_declined':
          errorMessage = 'Tu tarjeta fue rechazada. Verifica los datos e intenta nuevamente.';
          break;
        case 'insufficient_funds':
          errorMessage = 'Fondos insuficientes en la tarjeta.';
          break;
        case 'invalid_cvc':
          errorMessage = 'Código de seguridad inválido.';
          break;
        case 'expired_card':
          errorMessage = 'La tarjeta ha expirado.';
          break;
        case 'incorrect_number':
          errorMessage = 'Número de tarjeta incorrecto.';
          break;
        case 'authentication_required':
          errorMessage = 'Se requiere autenticación adicional para esta tarjeta.';
          break;
        default:
          errorMessage = `Error de pago: ${error.message}`;
      }

      return NextResponse.json(
        { code: error.code, error: errorMessage, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
