export interface ReservationTableData {
  id: string;
  userName: string;
  userEmail: string;
  venueName: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface ReservationsTableProps {
  data: ReservationTableData[];
  loading?: boolean;
  maxRows?: number;
}
