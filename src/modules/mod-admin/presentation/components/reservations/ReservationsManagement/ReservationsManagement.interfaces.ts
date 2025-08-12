export interface ReservationsManagementProps {
  // Component currently has no props - can be expanded later
}

export interface FilterState {
  statusFilter: string;
  dateFilter: string;
  searchTerm: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface ReservationsManagementState extends FilterState, PaginationState {
  loading: boolean;
  error: string | null;
}

export interface StatusColorType {
  confirmed: 'confirmed';
  pending: 'pending';
  cancelled: 'cancelled';
  completed: 'completed';
}

export type StatusColorVariant = keyof StatusColorType;

export type ActionButtonVariant = 'edit' | 'delete';
