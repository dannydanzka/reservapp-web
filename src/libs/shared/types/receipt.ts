// Receipt Types - Basic type definitions for receipt functionality
export type ReceiptType = 'payment' | 'refund' | 'credit';
export type ReceiptStatus = 'pending' | 'generated' | 'sent' | 'failed';

export interface Receipt {
  id: string;
  type: ReceiptType;
  status: ReceiptStatus;
  receiptNumber: string;
  paymentId: string;
  reservationId: string;
  userId: string;
  venueId: string;
  amount: number;
  currency: string;
  subtotalAmount: number;
  taxAmount?: number;
  feeAmount?: number;
  issueDate: string;
  generatedAt: string;
  sentAt?: string;
  downloadUrl?: string;
  pdfUrl?: string;
  emailTo?: string;
  isVerified?: boolean;
  metadata?: Record<string, any>;
}

export interface CreateReceiptData {
  type: ReceiptType;
  paymentId: string;
  reservationId: string;
  userId: string;
  venueId: string;
  amount: number;
  currency: string;
  taxAmount?: number;
  feeAmount?: number;
  emailTo?: string;
  metadata?: Record<string, any>;
}

export interface UpdateReceiptData {
  status?: ReceiptStatus;
  sentAt?: string;
  downloadUrl?: string;
  metadata?: Record<string, any>;
}

export interface ReceiptFilters {
  type?: ReceiptType;
  status?: ReceiptStatus;
  userId?: string;
  venueId?: string;
  paymentId?: string;
  reservationId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReceiptWithDetails extends Receipt {
  payment: {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  };
  reservation: {
    id: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    status: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  venue: {
    id: string;
    name: string;
    address: string;
  };
  service?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface PaginatedReceipts {
  data: ReceiptWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ReceiptStats {
  totalReceipts: number;
  generatedReceipts: number;
  sentReceipts: number;
  failedReceipts: number;
  totalAmount: number;
  averageAmount: number;
}

export interface ReceiptPDFData {
  receipt: ReceiptWithDetails;
  companyInfo: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    taxId?: string;
  };
  itemizedDetails: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  customFields?: Record<string, any>;
}

export interface ReceiptVerificationData {
  receiptId: string;
  verifiedBy: string;
  verificationNotes?: string;
  verificationDate: string;
  isValid: boolean;
  discrepancies?: string[];
}
