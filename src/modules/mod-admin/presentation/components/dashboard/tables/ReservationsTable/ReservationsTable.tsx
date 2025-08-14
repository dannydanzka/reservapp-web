'use client';

import React from 'react';

import { Calendar } from 'lucide-react';

import { useTranslation } from '@i18n/index';

import { ReservationsTableProps } from './ReservationsTable.interfaces';

import {
  AmountText,
  CustomerEmail,
  CustomerInfo,
  CustomerName,
  DateInfo,
  DateText,
  EmptyStateContainer,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  LoadingContainer,
  LoadingText,
  ServiceName,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSubtitle,
  TableTitle,
  TableWrapper,
  TimeText,
  VenueInfo,
  VenueName,
} from './ReservationsTable.styled';

/**
 * Reservations table component for displaying recent reservations in a clean table format
 */
export const ReservationsTable: React.FC<ReservationsTableProps> = ({
  data,
  loading = false,
  maxRows = 5,
}) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      currency: 'MXN',
      style: 'currency',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      cancelled: t('admin.dashboard.status.cancelled'),
      confirmed: t('admin.dashboard.status.confirmed'),
      pending: t('admin.dashboard.status.pending'),
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <TableContainer>
        <TableHeader>
          <TableTitle>{t('admin.dashboard.tables.recentReservations.title')}</TableTitle>
          <TableSubtitle>{t('admin.dashboard.tables.recentReservations.subtitle')}</TableSubtitle>
        </TableHeader>
        <LoadingContainer>
          <LoadingText>{t('common.loading')}</LoadingText>
        </LoadingContainer>
      </TableContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <TableContainer>
        <TableHeader>
          <TableTitle>{t('admin.dashboard.tables.recentReservations.title')}</TableTitle>
          <TableSubtitle>{t('admin.dashboard.tables.recentReservations.subtitle')}</TableSubtitle>
        </TableHeader>
        <EmptyStateContainer>
          <EmptyStateIcon>
            <Calendar size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>
            {t('admin.dashboard.tables.recentReservations.noData.title')}
          </EmptyStateTitle>
          <EmptyStateDescription>
            {t('admin.dashboard.tables.recentReservations.noData.description')}
          </EmptyStateDescription>
        </EmptyStateContainer>
      </TableContainer>
    );
  }

  const displayData = maxRows ? data.slice(0, maxRows) : data;

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>{t('admin.dashboard.tables.recentReservations.title')}</TableTitle>
        <TableSubtitle>{t('admin.dashboard.tables.recentReservations.subtitle')}</TableSubtitle>
      </TableHeader>

      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>
                {t('admin.dashboard.tables.recentReservations.columns.customer')}
              </TableHeaderCell>
              <TableHeaderCell>
                {t('admin.dashboard.tables.recentReservations.columns.venue')}
              </TableHeaderCell>
              <TableHeaderCell>
                {t('admin.dashboard.tables.recentReservations.columns.date')}
              </TableHeaderCell>
              <TableHeaderCell>
                {t('admin.dashboard.tables.recentReservations.columns.status')}
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  <CustomerInfo>
                    <CustomerName>{reservation.userName}</CustomerName>
                    <CustomerEmail>{reservation.userEmail}</CustomerEmail>
                  </CustomerInfo>
                </TableCell>
                <TableCell>
                  <VenueInfo>
                    <VenueName>{reservation.venueName}</VenueName>
                    <ServiceName>{reservation.serviceName}</ServiceName>
                  </VenueInfo>
                </TableCell>
                <TableCell>
                  <DateInfo>
                    <DateText>{formatDate(reservation.date)}</DateText>
                    <TimeText>{reservation.time}</TimeText>
                  </DateInfo>
                </TableCell>
                <TableCell>
                  <StatusBadge $status={reservation.status}>
                    {getStatusLabel(reservation.status)}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </TableContainer>
  );
};
