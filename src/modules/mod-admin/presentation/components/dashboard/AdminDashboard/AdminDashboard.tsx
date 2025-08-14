'use client';

import React from 'react';

import { Calendar, DollarSign, MapPin, Plus, Star, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAdminStats } from '@libs/presentation/hooks/useAdminStats';
import { useTranslation } from '@i18n/index';

import { AdminDashboardProps } from './AdminDashboard.interfaces';
import { ReservationsChart, RevenueChart } from '../charts';
import type { ReservationsChartData, RevenueChartData } from '../charts';
import { ReservationsTable, VenuesTable } from '../tables';

import {
  ChartsGrid,
  DashboardContainer,
  ErrorContainer,
  ErrorMessage,
  Header,
  LoadingContainer,
  StatCard,
  StatLabel,
  StatsGrid,
  StatValue,
  Subtitle,
  TablesGrid,
  Title,
} from './AdminDashboard.styled';

/**
 * Admin dashboard component with overview stats and recent activity.
 * Now with real data from the API, styled components and i18n.
 */
export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { error, loading, stats } = useAdminStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      currency: 'MXN',
      style: 'currency',
    }).format(amount);
  };

  // Use real data from API or fallback to empty arrays
  const revenueData = stats?.revenueChartData || [];
  const reservationsData = stats?.reservationsChartData || [];

  if (loading) {
    return (
      <LoadingContainer>
        <Header>
          <Title>{t('admin.dashboard.title')}</Title>
          <Subtitle>{t('common.loading')}</Subtitle>
        </Header>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Header>
          <Title>{t('admin.dashboard.title')}</Title>
          <ErrorMessage>{error}</ErrorMessage>
        </Header>
      </ErrorContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>{t('admin.dashboard.title')}</Title>
        <Subtitle>{t('admin.dashboard.subtitle')}</Subtitle>
      </Header>

      {/* Stats Cards */}
      <StatsGrid>
        <StatCard>
          <StatValue>{stats?.totalReservations || 0}</StatValue>
          <StatLabel>{t('admin.dashboard.stats.totalReservations')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats?.activeVenues || 0}</StatValue>
          <StatLabel>{t('admin.dashboard.stats.activeVenues')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatCurrency(stats?.monthlyRevenue || 0)}</StatValue>
          <StatLabel>{t('admin.dashboard.stats.monthlyRevenue')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats?.totalUsers || 0}</StatValue>
          <StatLabel>{t('admin.dashboard.stats.registeredUsers')}</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Charts Section */}
      <ChartsGrid>
        <RevenueChart data={revenueData} height={300} loading={loading} />
        <ReservationsChart data={reservationsData} height={300} loading={loading} />
      </ChartsGrid>

      {/* Tables Section */}
      <TablesGrid>
        <ReservationsTable data={stats?.recentReservations || []} loading={loading} maxRows={5} />
        <VenuesTable data={stats?.popularVenues || []} loading={loading} maxRows={5} />
      </TablesGrid>
    </DashboardContainer>
  );
};
