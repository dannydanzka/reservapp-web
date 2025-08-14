export interface RevenueChartData {
  month: string;
  revenue: number;
  growth?: number;
}

export interface RevenueChartProps {
  data: RevenueChartData[];
  loading?: boolean;
  height?: number;
}
