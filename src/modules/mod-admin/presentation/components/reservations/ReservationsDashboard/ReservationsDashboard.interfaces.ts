export interface ReservationWithPayment {
  id: string;
  confirmationId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  service: {
    id: string;
    name: string;
    venue: {
      id: string;
      name: string;
    };
  };
  payments: Array<{
    id: string;
    amount: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalReservations: number;
  pendingPayments: number;
  confirmedReservations: number;
  totalRevenue: number;
  completedPayments: number;
  failedPayments: number;
}

export interface ReservationFilters {
  dateFrom: string;
  dateTo: string;
  paymentStatus: string;
  search: string;
  status: string;
  venue: string;
}

export interface ReservationsDashboardProps {
  className?: string;
}

export interface ReservationsDashboardState {
  reservations: ReservationWithPayment[];
  stats: DashboardStats;
  loading: boolean;
  filters: ReservationFilters;
  currentPage: number;
  totalPages: number;
}

export interface ReservationsDashboardHandlers {
  handleStatusUpdate: (reservationId: string, newStatus: string) => Promise<void>;
  handleManualPaymentVerification: (paymentId: string) => Promise<void>;
  handleFiltersChange: (newFilters: ReservationFilters) => void;
  handlePageChange: (page: number) => void;
}

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW';
export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';
