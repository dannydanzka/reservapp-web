import type {
  CreateReceiptData,
  PaginatedReceipts,
  Receipt,
  ReceiptFilters,
  ReceiptPDFData,
  ReceiptStats,
  ReceiptVerificationData,
  ReceiptWithDetails,
} from '@shared/types/receipt';
// import { paymentRepository } from '@libs/data/repositories/PaymentRepository'; // Temporarily disabled
import { receiptRepository } from '../../repositories/ReceiptRepository';

export class ReceiptService {
  async createFromPayment(paymentId: string): Promise<Receipt> {
    // TODO: Re-implement when PaymentRepository is available
    throw new Error(
      'Receipt creation from payment is temporarily disabled - PaymentRepository unavailable'
    );
  }

  async getReceipts(filters: ReceiptFilters): Promise<PaginatedReceipts> {
    return receiptRepository.findMany(filters);
  }

  async getReceiptById(id: string): Promise<ReceiptWithDetails | null> {
    return receiptRepository.findByIdWithDetails(id);
  }

  async getReceiptByNumber(receiptNumber: string): Promise<Receipt | null> {
    return receiptRepository.findByReceiptNumber(receiptNumber);
  }

  async getReceiptByPaymentId(paymentId: string): Promise<Receipt | null> {
    return receiptRepository.findByPaymentId(paymentId);
  }

  async verifyReceipt(data: ReceiptVerificationData): Promise<Receipt> {
    return receiptRepository.adminVerifyReceipt(data);
  }

  async getStats(filters?: Omit<ReceiptFilters, 'page' | 'limit'>): Promise<ReceiptStats> {
    return receiptRepository.getStats(filters);
  }

  async generatePDF(receiptId: string): Promise<string> {
    try {
      const receipt = await receiptRepository.findByIdWithDetails(receiptId);
      if (!receipt) {
        throw new Error('Receipt not found');
      }

      const pdfData = this.preparePDFData(receipt);
      const pdfUrl = await this.createPDF(pdfData);

      await receiptRepository.update(receiptId, {
        pdfUrl,
      } as any);

      return pdfUrl;
    } catch (error) {
      throw new Error(
        `Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async regenerateReceipt(
    receiptId: string,
    adminUserId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Receipt> {
    try {
      const verificationData: ReceiptVerificationData = {
        isValid: true,
        receiptId,
        verificationDate: new Date().toISOString(),
        verificationNotes: `Receipt regenerated: ${reason}`,
        verifiedBy: adminUserId,
      };

      const regeneratedReceipt = await this.verifyReceipt(verificationData);

      // Generate new PDF for regenerated receipt
      await this.generatePDF(receiptId);

      return regeneratedReceipt;
    } catch (error) {
      throw new Error(
        `Error regenerating receipt: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getPendingVerificationReceipts(): Promise<ReceiptWithDetails[]> {
    const result = await receiptRepository.findMany({
      limit: 100,
      status: 'pending',
    });

    return result.data;
  }

  async getRejectedReceipts(): Promise<ReceiptWithDetails[]> {
    const result = await receiptRepository.findMany({
      limit: 100,
      status: 'failed',
    });

    return result.data;
  }

  async bulkVerifyReceipts(
    receiptIds: string[],
    adminUserId: string,
    notes: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    const results: Array<{ id: string; success: boolean; error?: string }> = [];

    for (const receiptId of receiptIds) {
      try {
        await this.verifyReceipt({
          isValid: true,
          receiptId,
          verificationDate: new Date().toISOString(),
          verificationNotes: notes,
          verifiedBy: adminUserId,
        });

        results.push({ id: receiptId, success: true });
      } catch (error) {
        results.push({
          error: error instanceof Error ? error.message : 'Unknown error',
          id: receiptId,
          success: false,
        });
      }
    }

    return results;
  }

  private preparePDFData(receipt: ReceiptWithDetails): ReceiptPDFData {
    // TODO: Re-implement when PaymentRepository is available
    // For now, provide minimal data without payment/reservation details
    return {
      companyInfo: {
        address: '123 Business Street, Ciudad de México, México',
        email: 'invoices@reservapp.com',
        name: 'ReservApp',
        phone: '+52 55 1234 5678',
        taxId: 'RFC123456789',
        website: 'https://reservapp.com',
      },
      itemizedDetails: [
        {
          description: 'Service details unavailable (PaymentRepository disabled)',
          quantity: 1,
          totalPrice: receipt.subtotalAmount,
          unitPrice: receipt.subtotalAmount,
        },
      ],
      receipt,
    };
  }

  private async createPDF(data: ReceiptPDFData): Promise<string> {
    try {
      // This is a simplified version - in production you'd use a PDF generation library
      // like puppeteer, jsPDF, or a service like HTML/CSS to PDF

      const pdfContent = this.generatePDFContent(data);

      // For now, return a mock URL - in production this would:
      // 1. Generate actual PDF using a library
      // 2. Upload to cloud storage (AWS S3, Cloudinary, etc.)
      // 3. Return the public URL

      const mockPdfUrl = `/api/receipts/${data.receipt.id}/pdf`;

      return mockPdfUrl;
    } catch (error) {
      throw new Error(
        `Error creating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private generatePDFContent(data: ReceiptPDFData): string {
    const { companyInfo, itemizedDetails, receipt } = data;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo ${receipt.receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { margin-bottom: 30px; }
          .receipt-info { margin-bottom: 30px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f2f2f2; }
          .totals { text-align: right; }
          .total-line { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RECIBO DE PAGO</h1>
          <p>No. ${receipt.receiptNumber}</p>
        </div>
        
        <div class="company-info">
          <h3>${companyInfo.name}</h3>
          <p>${companyInfo.address}</p>
          <p>RFC: ${companyInfo.taxId}</p>
          <p>Email: ${companyInfo.email}</p>
          ${companyInfo.phone ? `<p>Tel: ${companyInfo.phone}</p>` : ''}
        </div>
        
        <div class="receipt-info">
          <p><strong>Cliente:</strong> ${receipt.user.firstName} ${receipt.user.lastName}</p>
          <p><strong>Email:</strong> ${receipt.user.email}</p>
          <p><strong>Fecha de emisión:</strong> ${new Date(receipt.issueDate).toLocaleDateString('es-MX')}</p>
          <p><strong>Venue:</strong> Información no disponible (PaymentRepository deshabilitado)</p>
          <p><strong>Servicio:</strong> Información no disponible (PaymentRepository deshabilitado)</p>
          <p><strong>Confirmación:</strong> Información no disponible (PaymentRepository deshabilitado)</p>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemizedDetails
              .map(
                (item) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.unitPrice.toFixed(2)}</td>
                <td>$${item.totalPrice.toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-line"><strong>Subtotal: $${receipt.subtotalAmount.toFixed(2)}</strong></div>
          ${receipt.taxAmount ? `<div class="total-line"><strong>IVA (16%): $${receipt.taxAmount.toFixed(2)}</strong></div>` : ''}
          <div class="total-line"><strong>Total: $${receipt.amount.toFixed(2)}</strong></div>
        </div>
        
        <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
          <p>Este recibo fue generado automáticamente por el sistema ReservApp</p>
          <p>Estado de verificación: ${receipt.isVerified ? 'VERIFICADO' : 'PENDIENTE'}</p>
        </div>
      </body>
      </html>
    `;
  }
}

export const receiptService = new ReceiptService();
