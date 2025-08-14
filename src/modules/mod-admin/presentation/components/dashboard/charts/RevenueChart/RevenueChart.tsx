'use client';

import React from 'react';

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart, TrendingUp } from 'lucide-react';

import { useTranslation } from '@i18n/index';

import { RevenueChartProps } from './RevenueChart.interfaces';

import {
  ChartContainer,
  ChartContent,
  ChartHeader,
  ChartSubtitle,
  ChartTitle,
  EmptyStateContainer,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  LoadingContainer,
  LoadingText,
} from './RevenueChart.styled';

/**
 * Revenue chart component showing revenue trends over time
 */
export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  height = 300,
  loading = false,
}) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      currency: 'MXN',
      style: 'currency',
    }).format(value);
  };

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>{t('admin.dashboard.charts.revenue.title')}</ChartTitle>
          <ChartSubtitle>{t('admin.dashboard.charts.revenue.subtitle')}</ChartSubtitle>
        </ChartHeader>
        <ChartContent>
          <LoadingContainer>
            <LoadingText>{t('common.loading')}</LoadingText>
          </LoadingContainer>
        </ChartContent>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>{t('admin.dashboard.charts.revenue.title')}</ChartTitle>
          <ChartSubtitle>{t('admin.dashboard.charts.revenue.subtitle')}</ChartSubtitle>
        </ChartHeader>
        <ChartContent>
          <EmptyStateContainer>
            <EmptyStateIcon>
              <TrendingUp size={32} />
            </EmptyStateIcon>
            <EmptyStateTitle>{t('admin.dashboard.charts.revenue.noData.title')}</EmptyStateTitle>
            <EmptyStateDescription>
              {t('admin.dashboard.charts.revenue.noData.description')}
            </EmptyStateDescription>
          </EmptyStateContainer>
        </ChartContent>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>{t('admin.dashboard.charts.revenue.title')}</ChartTitle>
        <ChartSubtitle>{t('admin.dashboard.charts.revenue.subtitle')}</ChartSubtitle>
      </ChartHeader>
      <ChartContent>
        <ResponsiveContainer height={height} width='100%'>
          <RechartsBarChart data={data}>
            <CartesianGrid stroke='#e0e7ff' strokeDasharray='3 3' />
            <XAxis
              axisLine={{ stroke: '#d1d5db' }}
              dataKey='month'
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
              axisLine={{ stroke: '#d1d5db' }}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [
                formatCurrency(value),
                t('admin.dashboard.charts.revenue.revenue'),
              ]}
              labelStyle={{ color: '#1f2937' }}
            />
            <Bar dataKey='revenue' fill='#7c3aed' radius={[4, 4, 0, 0]} strokeWidth={0} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartContent>
    </ChartContainer>
  );
};
