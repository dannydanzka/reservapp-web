'use client';

import { CheckCircle, Clock, DollarSign, RotateCcw, TrendingUp, XCircle } from 'lucide-react';

import { AdminPaymentStats } from '@shared/types/admin.types';
import { Card } from '@ui/Card';
import { useTranslation } from '@i18n/index';

import type { PaymentStatsProps, StatCardData } from './PaymentStats.interfaces';

import * as S from './PaymentStats.styled';

export const PaymentStats = ({ stats }: PaymentStatsProps) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      currency: 'MXN',
      style: 'currency',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const statsCards: StatCardData[] = [
    {
      amount: formatCurrency(stats.totalRevenue),
      bgColor: 'bg-blue-50',
      color: 'blue',
      icon: DollarSign,
      iconColor: 'text-blue-600',
      title: 'Total de Pagos',
      value: stats.totalTransactions.toLocaleString(),
    },
    {
      amount: formatCurrency(stats.completedAmount),
      bgColor: 'bg-green-50',
      color: 'green',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      percentage:
        stats.totalTransactions > 0
          ? (stats.completedTransactions / stats.totalTransactions) * 100
          : 0,
      title: 'Pagos Completados',
      value: stats.completedTransactions.toLocaleString(),
    },
    {
      amount: formatCurrency(stats.pendingAmount),
      bgColor: 'bg-yellow-50',
      color: 'yellow',
      icon: Clock,
      iconColor: 'text-yellow-600',
      percentage:
        stats.totalTransactions > 0
          ? (stats.pendingTransactions / stats.totalTransactions) * 100
          : 0,
      title: 'Pagos Pendientes',
      value: stats.pendingTransactions.toLocaleString(),
    },
    {
      amount: formatCurrency(stats.failedAmount),
      bgColor: 'bg-red-50',
      color: 'red',
      icon: XCircle,
      iconColor: 'text-red-600',
      percentage:
        stats.totalTransactions > 0
          ? (stats.failedTransactions / stats.totalTransactions) * 100
          : 0,
      title: 'Pagos Fallidos',
      value: stats.failedTransactions.toLocaleString(),
    },
    {
      amount: formatCurrency(stats.refundedAmount),
      bgColor: 'bg-purple-50',
      color: 'purple',
      icon: RotateCcw,
      iconColor: 'text-purple-600',
      percentage:
        stats.completedTransactions > 0
          ? (stats.refundedTransactions / stats.completedTransactions) * 100
          : 0,
      title: 'Pagos Reembolsados',
      value: stats.refundedTransactions.toLocaleString(),
    },
    {
      amount: formatCurrency(stats.averageTransaction),
      bgColor: 'bg-indigo-50',
      color: 'indigo',
      icon: TrendingUp,
      iconColor: 'text-indigo-600',
      subtitle: 'Monto Promedio',
      title: 'Tasa de Éxito',
      value: formatPercentage(stats.successRate),
    },
  ];

  return (
    <S.StatsGrid>
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <S.StatCard $bgColor={stat.bgColor}>
            <S.StatCardContent>
              <S.StatCardMain>
                <S.StatCardHeader>
                  <S.StatIcon $iconColor={stat.iconColor}>
                    <stat.icon />
                  </S.StatIcon>
                  <S.StatTitle>{stat.title}</S.StatTitle>
                </S.StatCardHeader>

                <S.StatContent>
                  <S.StatValue>{stat.value}</S.StatValue>

                  {stat.amount && <S.StatAmount>{stat.amount}</S.StatAmount>}

                  {stat.subtitle && stat.amount && (
                    <S.StatSubtitleContainer>
                      <S.StatSubtitle>{stat.subtitle}</S.StatSubtitle>
                      <S.StatSubAmount>{stat.amount}</S.StatSubAmount>
                    </S.StatSubtitleContainer>
                  )}

                  {stat.percentage !== undefined && (
                    <S.StatPercentageContainer>
                      <S.StatPercentageDot $color={stat.color} />
                      <S.StatPercentage>{formatPercentage(stat.percentage)}</S.StatPercentage>
                    </S.StatPercentageContainer>
                  )}
                </S.StatContent>
              </S.StatCardMain>
            </S.StatCardContent>
          </S.StatCard>
        </Card>
      ))}
    </S.StatsGrid>
  );
};
