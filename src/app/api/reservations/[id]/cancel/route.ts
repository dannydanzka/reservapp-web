import { NextRequest, NextResponse } from 'next/server';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { PaymentStatus, RefundStatus, ReservationStatus } from '@prisma/client';
import { prisma } from '@libs/infrastructure/services/core/database/prismaService';
import { ResendService } from '@libs/infrastructure/services/core/email/resendService';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return AuthMiddleware.withAuth(async (req: NextRequest, user) => {
    try {
      const { id: reservationId } = await params;
      const body = await request.json();
      const { reason } = body;

      // Get the reservation with related data
      const reservation = await prisma.reservation.findFirst({
        include: {
          payments: {
            where: {
              status: PaymentStatus.COMPLETED,
            },
          },
          service: {
            select: {
              cancellationPolicy: true,
              category: true,
              id: true,
              name: true,
              price: true,
            },
          },
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
              address: true,
              city: true,
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: reservationId,
          // Users can only cancel their own reservations, admins can cancel any
          ...(user.role === 'USER' ? { userId: user.id } : {}),
        },
      });

      if (!reservation) {
        return NextResponse.json(
          { error: 'Reservación no encontrada', success: false },
          { status: 404 }
        );
      }

      // Check if reservation can be cancelled
      if (reservation.status === ReservationStatus.CANCELLED) {
        return NextResponse.json(
          { error: 'La reservación ya está cancelada', success: false },
          { status: 400 }
        );
      }

      if (reservation.status === ReservationStatus.COMPLETED) {
        return NextResponse.json(
          { error: 'No se puede cancelar una reservación completada', success: false },
          { status: 400 }
        );
      }

      // Calculate refund amount based on cancellation policy
      let refundAmount = 0;
      let refundStatus: RefundStatus = RefundStatus.PENDING;

      const now = new Date();
      const checkInDate = new Date(reservation.checkInDate);
      const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Refund policy:
      // - More than 48 hours: 100% refund
      // - 24-48 hours: 50% refund
      // - Less than 24 hours: No refund
      if (hoursUntilCheckIn > 48) {
        refundAmount = Number(reservation.totalAmount);
      } else if (hoursUntilCheckIn > 24) {
        refundAmount = Number(reservation.totalAmount) * 0.5;
      } else {
        refundAmount = 0;
      }

      // Update reservation status
      const updatedReservation = await prisma.reservation.update({
        data: {
          cancelReason: reason || 'Cancelación solicitada por el usuario',
          cancelledAt: now,
          refundAmount: refundAmount,
          refundStatus: refundAmount > 0 ? RefundStatus.PENDING : RefundStatus.COMPLETED,
          status: ReservationStatus.CANCELLED,
        },
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
        where: { id: reservationId },
      });

      // Process refund if applicable
      if (refundAmount > 0 && reservation.payments.length > 0) {
        // In a real implementation, you would process the refund through Stripe
        // For now, we'll just update the status
        await prisma.reservation.update({
          data: {
            refundStatus: RefundStatus.PROCESSING,
          },
          where: { id: reservationId },
        });

        // TODO: Implement actual Stripe refund processing
        // const refund = await stripe.refunds.create({
        //   payment_intent: reservation.payments[0].stripePaymentId,
        //   amount: Math.round(refundAmount * 100), // Stripe uses cents
        // });
      }

      // Create cancellation notification
      try {
        await prisma.notification.create({
          data: {
            message: `Tu reserva en ${reservation.venue.name} ha sido cancelada. ${refundAmount > 0 ? `Reembolso de ${refundAmount.toLocaleString('es-MX', { currency: 'MXN', style: 'currency' })} será procesado.` : 'Sin reembolso aplicable.'}`,
            metadata: {
              cancelReason: reason || 'Cancelación solicitada',
              cancelledAt: now.toISOString(),
              confirmationId: reservation.confirmationId,
              refundAmount: refundAmount,
              reservationId: reservation.id,
              serviceName: reservation.service.name,
              venueName: reservation.venue.name,
            },
            title: '❌ Reserva cancelada',
            type: 'RESERVATION_CANCELLATION',
            userId: reservation.user.id,
          },
        });
      } catch (notificationError) {
        console.error('Error creating cancellation notification:', notificationError);
        // Don't fail the cancellation if notification creation fails
      }

      // Send cancellation email
      try {
        await ResendService.sendTemplateEmail({
          data: {
            cancelReason: reason || 'Cancelación solicitada',
            cancelledAt: now.toLocaleDateString('es-MX'),
            checkInDate: reservation.checkInDate.toLocaleDateString('es-MX'),
            refundAmount: refundAmount.toLocaleString('es-MX', {
              currency: 'MXN',
              style: 'currency',
            }),
            reservationId: reservation.confirmationId,
            serviceName: reservation.service.name,
            totalAmount: Number(reservation.totalAmount).toLocaleString('es-MX', {
              currency: 'MXN',
              style: 'currency',
            }),
            userEmail: reservation.user.email,
            userName: `${reservation.user.firstName} ${reservation.user.lastName}`,
            venueName: reservation.venue.name,
          },
          subject: 'Confirmación de Cancelación - ReservApp',
          template: 'reservation-cancellation',
          to: reservation.user.email,
        });
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError);
        // Don't fail the cancellation if email fails
      }

      return NextResponse.json({
        data: {
          cancelReason: updatedReservation.cancelReason,
          cancelledAt: updatedReservation.cancelledAt,
          confirmationId: updatedReservation.confirmationId,
          refundAmount: updatedReservation.refundAmount,
          refundStatus: updatedReservation.refundStatus,
          reservationId: updatedReservation.id,
          status: updatedReservation.status,
        },
        message: 'Reservación cancelada exitosamente',
        success: true,
      });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor', success: false },
        { status: 500 }
      );
    }
  })(request);
}
