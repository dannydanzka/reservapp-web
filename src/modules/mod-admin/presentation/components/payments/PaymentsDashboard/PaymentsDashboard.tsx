'use client';

import { useCallback, useState } from 'react';

import { Download, RefreshCw } from 'lucide-react';

import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { ErrorMessage } from '@ui/ErrorMessage';
import { LoadingSpinner } from '@ui/LoadingSpinner';
import { useTranslation } from '@i18n/index';

import { PaymentFilters } from '../PaymentFilters';
import type { PaymentsDashboardProps } from './PaymentsDashboard.interfaces';
import { PaymentStats } from '../PaymentStats';
import { PaymentTable } from '../PaymentTable';
import { usePaymentManagement } from '../../../hooks/payments/usePaymentManagement';

import * as S from './PaymentsDashboard.styled';

export const PaymentsDashboard = ({ className }: PaymentsDashboardProps) => {
  const { t } = useTranslation();

  // Use the payment management hook
  const {
    error,
    exportPayments,
    filters,
    loading: isLoading,
    pagination,
    payments,
    processRefund,
    refresh,
    setFilters,
    setPage,
    stats,
    updatePaymentStatus,
    venues,
  } = usePaymentManagement();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: any) => {
      setFilters({
        endDate: newFilters.endDate,
        search: newFilters.search,
        startDate: newFilters.startDate,
        status: newFilters.status,
        userId: newFilters.userId,
        venueId: newFilters.venueId,
      });
    },
    [setFilters]
  );

  // Handle pagination
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage]
  );

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  // Handle payment actions
  const handleRefund = useCallback(
    async (paymentId: string, amount?: number, reason?: string) => {
      try {
        await processRefund(paymentId, amount, reason);
      } catch (err) {
        console.error('Error processing refund:', err);
        throw err;
      }
    },
    [processRefund]
  );

  const handleStatusUpdate = useCallback(
    async (paymentId: string, status: any, notes?: string) => {
      try {
        await updatePaymentStatus(paymentId, status, notes);
      } catch (err) {
        console.error('Error updating payment status:', err);
        throw err;
      }
    },
    [updatePaymentStatus]
  );

  // Export functionality

  if (isLoading) {
    return (
      <S.LoadingContainer>
        <LoadingSpinner size='large' />
      </S.LoadingContainer>
    );
  }

  return (
    <S.DashboardContainer className={className}>
      {/* Header */}
      <S.HeaderSection>
        <S.HeaderContent>
          <S.HeaderTitle>Gestión de Pagos</S.HeaderTitle>
          <S.HeaderSubtitle>Administra pagos, reembolsos y estados de pago</S.HeaderSubtitle>
        </S.HeaderContent>

        <S.HeaderActions>
          <Button disabled={isRefreshing} variant='outlined' onClick={handleRefresh}>
            Actualizar
          </Button>
        </S.HeaderActions>
      </S.HeaderSection>

      {/* Stats Cards */}
      {stats && <PaymentStats stats={stats} />}

      {/* Filters */}
      <Card className='p-6'>
        <PaymentFilters
          filters={filters}
          venues={venues.map((venue) => ({ label: venue.name, value: venue.id }))}
          onFiltersChange={handleFiltersChange}
        />
      </Card>

      {/* Error Message */}
      {error && <ErrorMessage error={error} />}

      {/* Payments Table */}
      <Card className='overflow-hidden'>
        <PaymentTable
          isRefreshing={isRefreshing}
          pagination={pagination}
          payments={payments}
          onPageChange={handlePageChange}
          onRefund={handleRefund}
          onStatusUpdate={handleStatusUpdate}
        />
      </Card>
    </S.DashboardContainer>
  );
};
