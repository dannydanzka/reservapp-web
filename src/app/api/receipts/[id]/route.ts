import { NextRequest, NextResponse } from 'next/server';

import { AuthMiddleware } from '@libs/infrastructure/services/core/auth/authMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/receipts/[id]
 * Get detailed information about a specific receipt
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    const { id } = await params;

    // Get receipt with all related data
    const receipt = await prisma.receipt.findFirst({
      include: {
        payment: {
          include: {
            reservation: {
              include: {
                service: {
                  select: {
                    category: true,
                    description: true,
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
                    country: true,
                    email: true,
                    id: true,
                    name: true,
                    owner: {
                      select: {
                        businessAccount: {
                          select: {
                            address: true,
                            businessName: true,
                            businessType: true,
                            city: true,
                            contactEmail: true,
                            contactPhone: true,
                            legalName: true,
                            state: true,
                            taxId: true,
                            zipCode: true,
                          },
                        },
                      },
                    },
                    phone: true,
                    state: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id,
        userId: user.id, // Ensure user owns this receipt
      },
    });

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found', success: false }, { status: 404 });
    }

    // Format business information for the receipt
    const businessInfo = receipt.payment.reservation?.venue.owner?.businessAccount;
    const venueInfo = receipt.payment.reservation?.venue;

    // Format complete receipt data
    const formattedReceipt = {
      amount: Number(receipt.amount),

      // Venue/Business information (if applicable)
      business:
        businessInfo && venueInfo
          ? {
              // Address information
              address: businessInfo.address || venueInfo.address,

              businessType: businessInfo.businessType,

              city: businessInfo.city || venueInfo.city,

              contactEmail: businessInfo.contactEmail || venueInfo.email,

              contactPhone: businessInfo.contactPhone || venueInfo.phone,

              country: venueInfo.country,

              legalName: businessInfo.legalName,
              name: businessInfo.businessName || venueInfo.name,
              state: businessInfo.state || venueInfo.state,
              taxId: businessInfo.taxId,
              // Venue details
              venue: {
                category: venueInfo.category,
                id: venueInfo.id,
                name: venueInfo.name,
              },

              zipCode: businessInfo.zipCode,
            }
          : null,

      createdAt: receipt.createdAt,
      currency: receipt.currency,

      // Customer information
      customer: {
        email: user.email,
        firstName: user.firstName,
        fullName: `${user.firstName} ${user.lastName}`,
        id: user.id,
        lastName: user.lastName,
        phone: user.phone,
      },

      dueDate: receipt.dueDate,

      // Receipt basic information
      id: receipt.id,

      isVerified: receipt.isVerified,

      issueDate: receipt.issueDate,

      metadata: receipt.metadata,

      paidDate: receipt.paidDate,

      // Payment information
      payment: {
        amount: Number(receipt.payment.amount),
        createdAt: receipt.payment.createdAt,
        currency: receipt.payment.currency,
        description: receipt.payment.description,
        id: receipt.payment.id,
        paymentMethod: receipt.payment.paymentMethod,
        status: receipt.payment.status,
        stripePaymentId: receipt.payment.stripePaymentId,
        transactionDate: receipt.payment.transactionDate,
      },

      pdfUrl: receipt.pdfUrl,

      receiptNumber: receipt.receiptNumber,

      // Service/Reservation information (if applicable)
      service: receipt.payment.reservation
        ? {
            basePrice: Number(receipt.payment.reservation.service.price),
            category: receipt.payment.reservation.service.category,
            description: receipt.payment.reservation.service.description,
            id: receipt.payment.reservation.service.id,
            name: receipt.payment.reservation.service.name,

            // Reservation details
            reservation: {
              checkInDate: receipt.payment.reservation.checkInDate,
              checkOutDate: receipt.payment.reservation.checkOutDate,
              confirmationId: receipt.payment.reservation.confirmationId,
              guests: receipt.payment.reservation.guests,
              id: receipt.payment.reservation.id,
              status: receipt.payment.reservation.status,
            },
          }
        : null,

      status: receipt.status,

      // Subscription information (if applicable) - check metadata
      subscription: (receipt.payment.metadata as any)?.paymentType === 'subscription',

      subtotalAmount: Number(receipt.subtotalAmount),

      taxAmount: receipt.taxAmount ? Number(receipt.taxAmount) : null,

      // Tax calculations breakdown
      taxBreakdown: receipt.taxAmount
        ? {
            subtotal: Number(receipt.subtotalAmount),
            // IVA Mexico
            taxAmount: Number(receipt.taxAmount),
            taxRate: 0.16,
            total: Number(receipt.amount),
          }
        : null,

      type: receipt.type,

      updatedAt: receipt.updatedAt,

      verifiedBy: receipt.verifiedBy,
    };

    return NextResponse.json({
      data: formattedReceipt,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching receipt details:', error);
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
