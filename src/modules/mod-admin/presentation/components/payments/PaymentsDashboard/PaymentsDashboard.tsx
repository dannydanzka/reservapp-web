'use client';

import { useCallback, useEffect, useState } from 'react';

import { Download, RefreshCw } from 'lucide-react';

import { adminPaymentService } from '@services/admin';
import {
  AdminPaymentStats,
  AdminPaymentView,
  PaginatedAdminPayments,
  PaymentStatus,
} from '@shared/types/admin.types';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { ErrorMessage } from '@ui/ErrorMessage';
import { LoadingSpinner } from '@ui/LoadingSpinner';
import { useTranslation } from '@i18n/index';

import { AdminPaymentFilters, AdminVenueOption } from '../PaymentFilters/PaymentFilters.interfaces';
import { PaymentFilters } from '../PaymentFilters';
import type { PaymentsDashboardProps } from './PaymentsDashboard.interfaces';
import { PaymentStats } from '../PaymentStats';
import { PaymentTable } from '../PaymentTable';

import * as S from './PaymentsDashboard.styled';

export const PaymentsDashboard = ({ className }: PaymentsDashboardProps) => {
  const { t } = useTranslation();

  // State
  const [payments, setPayments] = useState<AdminPaymentView[]>([]);
  const [stats, setStats] = useState<AdminPaymentStats | null>(null);
  const [venues, setVenues] = useState<AdminVenueOption[]>([]);
  const [filters, setFilters] = useState<AdminPaymentFilters>({
    limit: 20,
    page: 1,
  });
  const [pagination, setPagination] = useState({
    hasMore: false,
    limit: 20,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load payments
  const loadPayments = useCallback(
    async (newFilters?: AdminPaymentFilters) => {
      try {
        setError(null);
        const filtersToUse = newFilters || filters;

        const result: PaginatedAdminPayments = (await adminPaymentService.getPayments(
          filtersToUse as any
        )) as any;

        setPayments(result.data);
        setPagination({
          hasMore: result.hasMore,
          limit: result.limit,
          page: result.page,
          total: result.total,
          totalPages: result.totalPages,
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al cargar pagos');
        console.error('Error loading payments:', error);
      }
    },
    [filters]
  );

  // Load stats
  const loadStats = useCallback(
    async (statsFilters?: Omit<AdminPaymentFilters, 'page' | 'limit'>) => {
      try {
        const stats = await adminPaymentService.getPaymentStats(statsFilters as any);
        setStats(stats as any);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },
    []
  );

  // Load venues
  const loadVenues = useCallback(async () => {
    try {
      const venuesData = await adminPaymentService.getVenues();
      setVenues(venuesData as any);
    } catch (error) {
      console.error('Error loading venues:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadPayments(), loadStats(), loadVenues()]);
      setIsLoading(false);
    };

    loadData();
  }, [loadPayments, loadStats, loadVenues]);

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: AdminPaymentFilters) => {
      const updatedFilters = {
        ...newFilters,
        page: 1, // Reset to first page when filters change
      };
      setFilters(updatedFilters);
      loadPayments(updatedFilters);
      loadStats(updatedFilters);
    },
    [loadPayments, loadStats]
  );

  // Handle pagination
  const handlePageChange = useCallback(
    (page: number) => {
      const updatedFilters = { ...filters, page };
      setFilters(updatedFilters);
      loadPayments(updatedFilters);
    },
    [filters, loadPayments]
  );

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([loadPayments(), loadStats()]);
    setIsRefreshing(false);
  }, [loadPayments, loadStats]);

  // Handle payment actions
  const handleRefund = useCallback(
    async (paymentId: string, amount?: number, reason?: string) => {
      try {
        await adminPaymentService.processRefund({
          amount,
          paymentId,
          reason,
        });

        // Refresh data
        await Promise.all([loadPayments(), loadStats()]);
      } catch (error) {
        console.error('Error processing refund:', error);
        throw error;
      }
    },
    [loadPayments, loadStats]
  );

  const handleStatusUpdate = useCallback(
    async (paymentId: string, status: PaymentStatus, notes?: string) => {
      try {
        await adminPaymentService.updatePaymentStatus({
          notes,
          paymentId,
          status: status as any,
          verificationMethod: 'manual',
        });

        // Refresh data
        await Promise.all([loadPayments(), loadStats()]);
      } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }
    },
    [loadPayments, loadStats]
  );

  // Export functionality
  const handleExport = useCallback(
    async (format: 'csv' | 'xlsx') => {
      try {
        // Get all payments with current filters (no pagination)
        const exportFilters = { ...filters };
        delete exportFilters.page;
        delete exportFilters.limit;

        const allPayments = await adminPaymentService.getPayments(exportFilters as any);

        // Create and download file
        const filename = `payments_export_${new Date().toISOString().split('T')[0]}.${format}`;

        if (format === 'csv') {
          downloadCSV((allPayments as any).data, filename);
        } else {
          // For XLSX, we would need a library like xlsx or exceljs
          console.log('XLSX export not implemented yet');
        }
      } catch (error) {
        console.error('Error exporting payments:', error);
      }
    },
    [filters]
  );

  // CSV download helper
  const downloadCSV = (data: AdminPaymentView[], filename: string) => {
    const headers = [
      'ID',
      'Amount',
      'Currency',
      'Status',
      'User Name',
      'User Email',
      'Venue Name',
      'Service Name',
      'Reservation ID',
      'Created At',
      'Payment Method',
    ];

    const csvContent = [
      headers.join(','),
      ...data.map((payment) =>
        [
          payment.id,
          payment.amount,
          payment.currency,
          payment?.status,
          payment.userName,
          payment.userEmail,
          payment.venueName,
          payment.serviceName,
          payment.reservationId,
          payment.createdAt,
          payment.paymentMethod
            ? `${payment.paymentMethod.brand || payment.paymentMethod.type} ****${payment.paymentMethod.last4 || ''}`
            : '',
        ]
          .map((field) => `"${field}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <S.HeaderTitle>{t('admin.payments.title')}</S.HeaderTitle>
          <S.HeaderSubtitle>{t('admin.payments.subtitle')}</S.HeaderSubtitle>
        </S.HeaderContent>

        <S.HeaderActions>
          <Button
            disabled={payments.length === 0}
            variant='outlined'
            onClick={() => handleExport('csv')}
          >
            {t('common.exportCSV')}
          </Button>

          <Button disabled={isRefreshing} variant='outlined' onClick={handleRefresh}>
            {t('common.refresh')}
          </Button>
        </S.HeaderActions>
      </S.HeaderSection>

      {/* Stats Cards */}
      {stats && <PaymentStats stats={stats} />}

      {/* Filters */}
      <Card className='p-6'>
        <PaymentFilters filters={filters} venues={venues} onFiltersChange={handleFiltersChange} />
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
