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
 * GET /api/receipts/[id]/download
 * Download receipt PDF or generate if not exists
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

    // Get receipt with owner verification
    const receipt = await prisma.receipt.findFirst({
      include: {
        payment: {
          include: {
            reservation: {
              include: {
                service: { select: { category: true, name: true } },
                venue: {
                  select: {
                    address: true,
                    city: true,
                    country: true,
                    name: true,
                    owner: {
                      select: {
                        businessAccount: {
                          select: {
                            businessName: true,
                            legalName: true,
                            taxId: true,
                          },
                        },
                      },
                    },
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

    // Check if PDF already exists
    if (receipt.pdfUrl) {
      // In a real implementation, you would fetch the PDF from cloud storage
      // For now, we'll return the URL for the frontend to handle
      return NextResponse.json({
        data: {
          downloadUrl: receipt.pdfUrl,
          fileName: `receipt-${receipt.receiptNumber}.pdf`,
          receiptNumber: receipt.receiptNumber,
        },
        success: true,
      });
    }

    // Generate PDF receipt data for frontend processing
    const pdfData = {
      business: receipt.payment.reservation?.venue.owner?.businessAccount
        ? {
            address: receipt.payment.reservation.venue.address,
            city: receipt.payment.reservation.venue.city,
            country: receipt.payment.reservation.venue.country,
            legalName: receipt.payment.reservation.venue.owner.businessAccount.legalName,
            name: receipt.payment.reservation.venue.owner.businessAccount.businessName,
            state: receipt.payment.reservation.venue.state,
            taxId: receipt.payment.reservation.venue.owner.businessAccount.taxId,
          }
        : null,
      customer: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
      generatedAt: new Date().toISOString(),
      payment: {
        id: receipt.payment.id,
        method: receipt.payment.paymentMethod,
        stripePaymentId: receipt.payment.stripePaymentId,
        transactionDate: receipt.payment.transactionDate,
      },
      receipt: {
        amount: Number(receipt.amount),
        currency: receipt.currency,
        id: receipt.id,
        issueDate: receipt.issueDate,
        paidDate: receipt.paidDate,
        receiptNumber: receipt.receiptNumber,
        status: receipt.status,
        subtotalAmount: Number(receipt.subtotalAmount),
        taxAmount: receipt.taxAmount ? Number(receipt.taxAmount) : null,
        type: receipt.type,
      },
      service: receipt.payment.reservation
        ? {
            category: receipt.payment.reservation.service.category,
            checkInDate: receipt.payment.reservation.checkInDate,
            checkOutDate: receipt.payment.reservation.checkOutDate,
            name: receipt.payment.reservation.service.name,
            venue: receipt.payment.reservation.venue.name,
          }
        : null,
      subscription:
        (receipt.payment.metadata as any)?.paymentType === 'subscription'
          ? {
              planType: (receipt.payment.metadata as any)?.subscriptionType || 'Premium',
            }
          : null,
      taxBreakdown: receipt.taxAmount
        ? {
            subtotal: Number(receipt.subtotalAmount),
            // 16% IVA
            taxAmount: Number(receipt.taxAmount),
            taxRate: 16,
            total: Number(receipt.amount),
          }
        : null,
    };

    // In a real implementation, you would:
    // 1. Generate PDF using a library like puppeteer or jsPDF
    // 2. Upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 3. Update receipt record with PDF URL
    // 4. Return download URL

    // For now, return the data for frontend PDF generation
    return NextResponse.json({
      data: {
        fileName: `receipt-${receipt.receiptNumber}.pdf`,
        generatePdf: true,
        pdfData,
        receiptNumber: receipt.receiptNumber,
      },
      success: true,
    });
  } catch (error) {
    console.error('Error downloading receipt:', error);
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
 * POST /api/receipts/[id]/download
 * Update receipt with generated PDF URL
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const body = await request.json();
    const { pdfUrl } = body;

    if (!pdfUrl) {
      return NextResponse.json({ error: 'PDF URL is required', success: false }, { status: 400 });
    }

    // Verify receipt ownership and update
    const receipt = await prisma.receipt.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found', success: false }, { status: 404 });
    }

    // Update receipt with PDF URL
    const updatedReceipt = await prisma.receipt.update({
      data: {
        metadata: {
          ...((receipt.metadata as object) || {}),
          pdfGenerated: {
            generatedAt: new Date().toISOString(),
            generatedBy: user.id,
            url: pdfUrl,
          },
        },
        pdfUrl,
      },
      where: { id },
    });

    return NextResponse.json({
      data: {
        id: updatedReceipt.id,
        pdfUrl: updatedReceipt.pdfUrl,
        updatedAt: updatedReceipt.updatedAt,
      },
      message: 'PDF URL updated successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error updating receipt PDF URL:', error);
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
