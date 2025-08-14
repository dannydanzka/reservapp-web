'use client';

import React from 'react';

import { Calendar } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useTranslation } from '@i18n/index';

import { ReservationsChartProps } from './ReservationsChart.interfaces';

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
  LegendColor,
  LegendContainer,
  LegendItem,
  LegendLabel,
  LoadingContainer,
  LoadingText,
} from './ReservationsChart.styled';

/**
 * Reservations chart component showing booking trends over time
 */
export const ReservationsChart: React.FC<ReservationsChartProps> = ({
  data,
  height = 300,
  loading = false,
}) => {
  const { t } = useTranslation();

  const legendData = [
    {
      color: '#7c3aed',
      key: 'reservations',
      label: t('admin.dashboard.charts.reservations.total'),
    },
    { color: '#10b981', key: 'confirmed', label: t('admin.dashboard.status.confirmed') },
    { color: '#f59e0b', key: 'pending', label: t('admin.dashboard.status.pending') },
    { color: '#ef4444', key: 'cancelled', label: t('admin.dashboard.status.cancelled') },
  ];

  if (loading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>{t('admin.dashboard.charts.reservations.title')}</ChartTitle>
          <ChartSubtitle>{t('admin.dashboard.charts.reservations.subtitle')}</ChartSubtitle>
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
          <ChartTitle>{t('admin.dashboard.charts.reservations.title')}</ChartTitle>
          <ChartSubtitle>{t('admin.dashboard.charts.reservations.subtitle')}</ChartSubtitle>
        </ChartHeader>
        <ChartContent>
          <EmptyStateContainer>
            <EmptyStateIcon>
              <Calendar size={32} />
            </EmptyStateIcon>
            <EmptyStateTitle>
              {t('admin.dashboard.charts.reservations.noData.title')}
            </EmptyStateTitle>
            <EmptyStateDescription>
              {t('admin.dashboard.charts.reservations.noData.description')}
            </EmptyStateDescription>
          </EmptyStateContainer>
        </ChartContent>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>{t('admin.dashboard.charts.reservations.title')}</ChartTitle>
        <ChartSubtitle>{t('admin.dashboard.charts.reservations.subtitle')}</ChartSubtitle>
      </ChartHeader>
      <ChartContent>
        <LegendContainer>
          {legendData.map((item) => (
            <LegendItem key={item.key}>
              <LegendColor $color={item.color} />
              <LegendLabel>{item.label}</LegendLabel>
            </LegendItem>
          ))}
        </LegendContainer>

        <ResponsiveContainer height={height} width='100%'>
          <LineChart data={data}>
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
              tickLine={{ stroke: '#d1d5db' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Line
              activeDot={{ r: 6 }}
              dataKey='reservations'
              dot={{ fill: '#7c3aed', strokeWidth: 2 }}
              stroke='#7c3aed'
              strokeWidth={3}
              type='monotone'
            />
            <Line
              dataKey='confirmed'
              dot={{ fill: '#10b981', strokeWidth: 2 }}
              stroke='#10b981'
              strokeWidth={2}
              type='monotone'
            />
            <Line
              dataKey='pending'
              dot={{ fill: '#f59e0b', strokeWidth: 2 }}
              stroke='#f59e0b'
              strokeWidth={2}
              type='monotone'
            />
            <Line
              dataKey='cancelled'
              dot={{ fill: '#ef4444', strokeWidth: 2 }}
              stroke='#ef4444'
              strokeWidth={2}
              type='monotone'
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContent>
    </ChartContainer>
  );
};
