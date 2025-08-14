import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

import {
  AdminActionType,
  AdminResourceType,
  PaymentStatus,
  PrismaClient,
  UserRoleEnum,
} from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-07-30.basil',
});

/**
 * Handle payment actions: refunds, status updates, etc.
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

    // Only SUPER_ADMIN can perform payment actions
    if (decoded.role !== UserRoleEnum.SUPER_ADMIN) {
      return NextResponse.json(
        {
          message: 'Acceso denegado. Solo SUPER_ADMIN puede realizar acciones de pago',
          success: false,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, amount, notes, paymentId, reason, status, verificationMethod } = body;

    // Get payment data for audit logging
    const payment = await prisma.payment.findUnique({
      include: {
        reservation: {
          include: {
            service: { select: { id: true, name: true } },
            venue: { select: { id: true, name: true } },
          },
        },
        user: {
          select: { email: true, firstName: true, id: true, lastName: true },
        },
      },
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ message: 'Pago no encontrado', success: false }, { status: 404 });
    }

    const oldValues = {
      amount: payment.amount,
      metadata: payment.metadata,
      status: payment.status,
    };

    let result = null;
    let auditAction: AdminActionType;
    let newValues: any = {};

    switch (action) {
      case 'refund': {
        auditAction = AdminActionType.PAYMENT_REFUND;

        // Validate refund amount
        const refundAmount = amount || Number(payment.amount);
        if (refundAmount > Number(payment.amount)) {
          return NextResponse.json(
            {
              message: 'El monto del reembolso no puede ser mayor al monto del pago',
              success: false,
            },
            { status: 400 }
          );
        }

        // Process refund through Stripe if payment was made via Stripe
        if (payment.stripePaymentId) {
          try {
            const stripeRefund = await stripe.refunds.create({
              amount: Math.round(refundAmount * 100),
              metadata: {
                admin_reason: reason || 'Reembolso procesado por administrador',
                admin_user_id: decoded.userId,
                original_payment_id: payment.id,
              },
              payment_intent: payment.stripePaymentId,
              // Convert to cents
              reason: 'requested_by_customer',
            });

            // Update payment record
            result = await prisma.payment.update({
              data: {
                metadata: {
                  ...((payment.metadata as object) || {}),
                  refund: {
                    amount: refundAmount,
                    id: stripeRefund.id,
                    processedAt: new Date().toISOString(),
                    processedBy: decoded.userId,
                    reason: reason || 'Reembolso procesado por administrador',
                  },
                },
                status: PaymentStatus.REFUNDED,
              },
              where: { id: paymentId },
            });

            newValues = {
              refundAmount: refundAmount,
              refundReason: reason,
              status: PaymentStatus.REFUNDED,
            };
          } catch (stripeError: any) {
            console.error('Stripe refund error:', stripeError);
            return NextResponse.json(
              { message: `Error en Stripe: ${stripeError.message}`, success: false },
              { status: 400 }
            );
          }
        } else {
          // Manual refund (no Stripe payment)
          result = await prisma.payment.update({
            data: {
              metadata: {
                ...((payment.metadata as object) || {}),
                manualRefund: {
                  amount: refundAmount,
                  processedAt: new Date().toISOString(),
                  processedBy: decoded.userId,
                  reason: reason || 'Reembolso manual procesado por administrador',
                },
              },
              status: PaymentStatus.REFUNDED,
            },
            where: { id: paymentId },
          });

          newValues = {
            refundAmount: refundAmount,
            refundMethod: 'manual',
            refundReason: reason,
            status: PaymentStatus.REFUNDED,
          };
        }
        break;
      }

      case 'updateStatus':
        auditAction = AdminActionType.PAYMENT_STATUS_UPDATE;

        // Update payment status
        result = await prisma.payment.update({
          data: {
            metadata: {
              ...((payment.metadata as object) || {}),
              statusUpdate: {
                newStatus: status,
                previousStatus: payment.status,
                processedAt: new Date().toISOString(),
                processedBy: decoded.userId,
                reason: notes || 'Estado actualizado por administrador',
                verificationMethod: verificationMethod || 'manual',
              },
            },
            status: status as PaymentStatus,
          },
          where: { id: paymentId },
        });

        newValues = {
          status: status,
          statusReason: notes,
          verificationMethod: verificationMethod,
        };
        break;

      case 'manualVerification':
        auditAction = AdminActionType.PAYMENT_MANUAL_VERIFICATION;

        // Perform manual verification
        result = await prisma.payment.update({
          data: {
            metadata: {
              ...((payment.metadata as object) || {}),
              manualVerification: {
                method: 'admin_review',
                notes: notes || 'Verificación manual completada',
                verifiedAt: new Date().toISOString(),
                verifiedBy: decoded.userId,
              },
            },
          },
          where: { id: paymentId },
        });

        newValues = {
          verificationNotes: notes,
          verified: true,
        };
        break;

      default:
        return NextResponse.json({ message: 'Acción no válida', success: false }, { status: 400 });
    }

    // Create audit log entry
    await prisma.adminAuditLog.create({
      data: {
        action: auditAction,
        adminUserEmail: decoded.email || 'admin@reservapp.com',
        adminUserId: decoded.userId,
        adminUserName:
          `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim() || 'Admin User',
        ipAddress:
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        metadata: {
          customerEmail: payment.user.email,
          customerName: `${payment.user.firstName} ${payment.user.lastName}`,
          paymentAmount: payment.amount,
          reservationId: payment.reservation.id,
          serviceName: payment.reservation.service.name,
          venueName: payment.reservation.venue.name,
        },
        newValues: newValues,
        oldValues: oldValues,
        resourceId: paymentId,
        resourceType: AdminResourceType.PAYMENT,
        userAgent: request.headers.get('user-agent') || 'Unknown',
      },
    });

    return NextResponse.json({
      data: result,
      message: `Acción ${action} completada exitosamente`,
      success: true,
    });
  } catch (error) {
    console.error('Payment action error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Get venues for filtering (SUPER_ADMIN only)
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

    // Only SUPER_ADMIN can access all venues
    if (decoded.role !== UserRoleEnum.SUPER_ADMIN) {
      return NextResponse.json({ message: 'Acceso denegado', success: false }, { status: 403 });
    }

    // Get venues with owner information for better context
    const venues = await prisma.venue.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        category: true,
        city: true,
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
          },
        },
      },
      where: {
        isActive: true,
      },
    });

    const venueOptions = venues.map((venue) => ({
      businessName: venue.owner?.businessAccount?.businessName,
      businessType: venue.owner?.businessAccount?.businessType,
      category: venue.category,
      city: venue.city,
      id: venue.id,
      name: venue.name,
    }));

    return NextResponse.json({
      data: venueOptions,
      success: true,
    });
  } catch (error) {
    console.error('Get venues error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', success: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
