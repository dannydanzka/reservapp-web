'use client';

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { LoadingSpinner } from '@libs/ui/components/LoadingSpinner';
import {
  reservationService,
  ReservationStats,
  ReservationWithDetails,
} from '@libs/services/api/reservationService';
import { useAuth } from '@libs/ui/providers/AuthProvider';
import { useTranslation } from '@/libs/i18n';
import { venueService } from '@libs/services/api/venueService';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[10]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StatChange = styled.div<{ $isPositive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $isPositive, theme }) =>
    $isPositive ? theme.colors.success[600] : theme.colors.error[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const RecentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div``;

const ItemTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ItemSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[600]};
`;

const StatusBadge = styled.span<{ $status: 'confirmed' | 'pending' | 'cancelled' }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'confirmed':
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'pending':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'cancelled':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      default:
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
    }
  }}
`;

const QuickAction = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[100]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

/**
 * Admin dashboard component with overview stats and recent activity.
 */
export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [recentReservations, setRecentReservations] = useState<ReservationWithDetails[]>([]);
  const [totalVenues, setTotalVenues] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch reservation stats
        const statsData = await reservationService.getStats();
        setStats(statsData);

        // Fetch recent reservations (last 10)
        const recentData = await reservationService.getAllWithDetails({}, { limit: 10, page: 1 });
        setRecentReservations(recentData.reservations);

        // Fetch total venues count
        const venuesData = await venueService.getAll({});
        setTotalVenues(venuesData.length);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(t('admin.common.error'));

        // Fallback to demo data
        setStats({
          averageStay: 2.3,
          cancelled: 10,
          checkedIn: 234,
          checkedOut: 156,
          confirmed: 789,
          pending: 45,
          total: 1234,
          totalRevenue: 145670.5,
        });
        setRecentReservations([]);
        setTotalVenues(12);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      currency: 'MXN',
      style: 'currency',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
    }).format(new Date(dateString));
  };

  const getStatusInSpanish = (status: string): string => {
    return t(`admin.reservations.status.${status}` as any) || status;
  };

  const getStatusColor = (status: string): 'confirmed' | 'pending' | 'cancelled' => {
    switch (status) {
      case 'CONFIRMED':
      case 'CHECKED_IN':
      case 'CHECKED_OUT':
        return 'confirmed';
      case 'PENDING':
        return 'pending';
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const handleComingSoonAlert = () => {
    alert(t('admin.dashboard.quickActions.comingSoon'));
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            height: '400px',
            justifyContent: 'center',
          }}
        >
          <LoadingSpinner />
        </div>
      </DashboardContainer>
    );
  }

  const dashboardStats = stats
    ? [
        {
          change: t('admin.dashboard.stats.fromLastMonth', { value: '+12%' }),
          isPositive: true,
          label: t('admin.dashboard.stats.totalReservations'),
          value: stats.total.toLocaleString(),
        },
        {
          change: t('admin.dashboard.stats.fromLastMonth', { value: '+8%' }),
          isPositive: true,
          label: t('admin.dashboard.stats.activeVenues'),
          value: totalVenues.toLocaleString(),
        },
        {
          change: t('admin.dashboard.stats.fromLastMonth', { value: '+15%' }),
          isPositive: true,
          label: t('admin.dashboard.stats.totalRevenue'),
          value: formatCurrency(stats.totalRevenue),
        },
        {
          change: t('admin.dashboard.stats.days', { value: stats.averageStay }),
          isPositive: stats.averageStay >= 2,
          label: t('admin.dashboard.stats.averageStay'),
          value: `${stats.averageStay} ${t('admin.dashboard.stats.days')}`,
        },
      ]
    : [];

  return (
    <DashboardContainer>
      <Header>
        <Title>{t('admin.dashboard.title', { name: user?.name || 'Admin' })}</Title>
        <Subtitle>{t('admin.dashboard.subtitle')}</Subtitle>
      </Header>

      <StatsGrid>
        {dashboardStats.map((stat, index) => (
          <StatCard key={index}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
            <StatChange $isPositive={stat.isPositive}>{stat.change}</StatChange>
          </StatCard>
        ))}
      </StatsGrid>

      {error && (
        <div
          style={{
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            color: '#d97706',
            fontSize: '14px',
            marginBottom: '24px',
            padding: '12px',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <ContentGrid>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.recentReservations.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation) => (
                <RecentItem key={reservation.id}>
                  <ItemInfo>
                    <ItemTitle>{reservation.user.name}</ItemTitle>
                    <ItemSubtitle>
                      {reservation.service.name} • {reservation.service.venue.name} •{' '}
                      {formatDate(reservation.checkIn)}
                    </ItemSubtitle>
                  </ItemInfo>
                  <StatusBadge $status={getStatusColor(reservation.status)}>
                    {getStatusInSpanish(reservation.status)}
                  </StatusBadge>
                </RecentItem>
              ))
            ) : (
              <div style={{ color: '#6b7280', padding: '40px', textAlign: 'center' }}>
                {t('admin.dashboard.recentReservations.noReservations')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.quickActions.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickAction onClick={handleComingSoonAlert}>
              {t('admin.dashboard.quickActions.newReservation')}
            </QuickAction>
            <QuickAction onClick={handleComingSoonAlert}>
              {t('admin.dashboard.quickActions.addVenue')}
            </QuickAction>
            <QuickAction onClick={handleComingSoonAlert}>
              {t('admin.dashboard.quickActions.addService')}
            </QuickAction>
            <QuickAction onClick={handleComingSoonAlert}>
              {t('admin.dashboard.quickActions.generateReport')}
            </QuickAction>
            <QuickAction onClick={handleComingSoonAlert}>
              {t('admin.dashboard.quickActions.settings')}
            </QuickAction>
          </CardContent>
        </Card>
      </ContentGrid>
    </DashboardContainer>
  );
};
