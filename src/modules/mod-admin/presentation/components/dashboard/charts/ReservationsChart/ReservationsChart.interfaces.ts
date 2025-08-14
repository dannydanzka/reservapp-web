export interface ReservationsChartData {
  month: string;
  reservations: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export interface ReservationsChartProps {
  data: ReservationsChartData[];
  loading?: boolean;
  height?: number;
}
