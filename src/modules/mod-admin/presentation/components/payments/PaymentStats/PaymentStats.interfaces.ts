import { AdminPaymentStats } from '@shared/types/admin.types';

export interface PaymentStatsProps {
  stats: AdminPaymentStats;
}

export interface StatCard {
  title: string;
  value: string;
  amount?: string;
  subtitle?: string;
  percentage?: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  color: string;
}

export interface FormatFunctions {
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

export interface StatCardData extends Omit<StatCard, 'bgColor' | 'iconColor'> {
  bgColor: string;
  iconColor: string;
}
