'use client';

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { LoadingSpinner } from '@libs/ui/components/LoadingSpinner';
import {
  ReservationFilters,
  reservationService,
  ReservationWithDetails,
} from '@libs/services/api/reservationService';
import { ReservationStatus } from '@prisma/client';
import { useTranslation } from '@/libs/i18n';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    
    &:hover {
      background-color: ${theme.colors.primary[700]};
    }
  `
      : `
    background-color: ${theme.colors.white};
    color: ${theme.colors.secondary[700]};
    border: 1px solid ${theme.colors.secondary[300]};
    
    &:hover {
      background-color: ${theme.colors.secondary[50]};
    }
  `}
`;

const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary[700]};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

const TableHeader = styled.th`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary[700]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[100]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[900]};
`;

const StatusBadge = styled.span<{ $status: 'confirmed' | 'pending' | 'cancelled' | 'completed' }>`
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
      case 'completed':
        return `
          background-color: ${theme.colors.info[100]};
          color: ${theme.colors.info[700]};
        `;
      default:
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
    }
  }}
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  margin: 0 ${({ theme }) => theme.spacing[1]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $variant, theme }) =>
    $variant === 'delete'
      ? `
    background-color: ${theme.colors.error[100]};
    color: ${theme.colors.error[700]};
    
    &:hover {
      background-color: ${theme.colors.error[200]};
    }
  `
      : `
    background-color: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};
    
    &:hover {
      background-color: ${theme.colors.primary[200]};
    }
  `}
`;

/**
 * Reservations management component for admin interface.
 */
export const ReservationsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: ReservationFilters = {};

      if (statusFilter !== 'all') {
        filters.status = statusFilter as ReservationStatus;
      }

      if (dateFilter) {
        filters.checkIn = dateFilter;
      }

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await reservationService.getAllWithDetails(filters, {
        limit: itemsPerPage,
        page: currentPage,
      });

      setReservations(response.reservations);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError(t('admin.reservations.messages.loadingError'));
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, dateFilter, searchTerm, currentPage]);

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
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const getStatusInSpanish = (status: string): string => {
    return t(`admin.reservations.status.${status}` as any) || status;
  };

  const getStatusColor = (status: string): 'confirmed' | 'pending' | 'cancelled' | 'completed' => {
    switch (status) {
      case 'CONFIRMED':
      case 'CHECKED_IN':
        return 'confirmed';
      case 'CHECKED_OUT':
        return 'completed';
      case 'PENDING':
        return 'pending';
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const handleEdit = (reservationId: string) => {
    alert(t('admin.dashboard.quickActions.comingSoon'));
  };

  const handleDelete = async (reservationId: string) => {
    if (confirm(t('admin.reservations.confirmations.deleteReservation', { id: reservationId }))) {
      try {
        await reservationService.delete(reservationId);
        fetchReservations(); // Reload the list
        alert(t('admin.reservations.messages.reservationDeleted'));
      } catch (err) {
        alert(t('admin.reservations.messages.errorDeleting'));
      }
    }
  };

  const handleCancel = async (reservationId: string) => {
    if (confirm(t('admin.reservations.confirmations.cancelReservation', { id: reservationId }))) {
      try {
        await reservationService.cancel(reservationId);
        fetchReservations(); // Reload the list
        alert(t('admin.reservations.messages.reservationCancelled'));
      } catch (err) {
        alert(t('admin.reservations.messages.errorCancelling'));
      }
    }
  };

  const handleCheckIn = async (reservationId: string) => {
    try {
      await reservationService.checkIn(reservationId);
      fetchReservations(); // Reload the list
      alert(t('admin.reservations.messages.checkInSuccessful'));
    } catch (err) {
      alert(t('admin.reservations.messages.errorCheckIn'));
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    try {
      await reservationService.checkOut(reservationId);
      fetchReservations(); // Reload the list
      alert(t('admin.reservations.messages.checkOutSuccessful'));
    } catch (err) {
      alert(t('admin.reservations.messages.errorCheckOut'));
    }
  };

  const handleCreateNew = () => {
    alert(t('admin.dashboard.quickActions.comingSoon'));
  };

  const handleExport = () => {
    alert(t('admin.dashboard.quickActions.comingSoon'));
  };

  return (
    <Container>
      <Header>
        <Title>{t('admin.reservations.title')}</Title>
        <Actions>
          <Button $variant='primary' onClick={handleCreateNew}>
            {t('admin.reservations.newReservation')}
          </Button>
          <Button $variant='secondary' onClick={handleExport}>
            {t('admin.reservations.export')}
          </Button>
        </Actions>
      </Header>

      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <Label htmlFor='status'>{t('admin.reservations.filters.status')}</Label>
            <Select
              id='status'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value='all'>{t('admin.reservations.filters.allStatuses')}</option>
              <option value='PENDING'>{t('admin.reservations.status.PENDING')}</option>
              <option value='CONFIRMED'>{t('admin.reservations.status.CONFIRMED')}</option>
              <option value='CHECKED_IN'>{t('admin.reservations.status.CHECKED_IN')}</option>
              <option value='CHECKED_OUT'>{t('admin.reservations.status.CHECKED_OUT')}</option>
              <option value='CANCELLED'>{t('admin.reservations.status.CANCELLED')}</option>
              <option value='NO_SHOW'>{t('admin.reservations.status.NO_SHOW')}</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor='date'>{t('admin.reservations.filters.date')}</Label>
            <Input
              id='date'
              type='date'
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor='search'>{t('admin.reservations.filters.search')}</Label>
            <Input
              id='search'
              placeholder={t('admin.reservations.filters.searchPlaceholder')}
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      <TableContainer>
        {loading ? (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              height: '200px',
              justifyContent: 'center',
            }}
          >
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div style={{ color: '#ef4444', padding: '40px', textAlign: 'center' }}>{error}</div>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Cliente</TableHeader>
                <TableHeader>Servicio</TableHeader>
                <TableHeader>Venue</TableHeader>
                <TableHeader>Check-in / Check-out</TableHeader>
                <TableHeader>Estado</TableHeader>
                <TableHeader>Total</TableHeader>
                <TableHeader>Acciones</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <div>{reservation.user.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {reservation.user.email}
                      </div>
                    </TableCell>
                    <TableCell>{reservation.service.name}</TableCell>
                    <TableCell>
                      <div>{reservation.service.venue.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {reservation.service.venue.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{formatDate(reservation.checkIn)}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {formatDate(reservation.checkOut)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge $status={getStatusColor(reservation.status)}>
                        {getStatusInSpanish(reservation.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{formatCurrency(reservation.totalAmount)}</TableCell>
                    <TableCell>
                      {reservation.status === 'PENDING' && (
                        <>
                          <ActionButton onClick={() => handleEdit(reservation.id)}>
                            {t('admin.reservations.actions.edit')}
                          </ActionButton>
                          <ActionButton
                            $variant='delete'
                            onClick={() => handleCancel(reservation.id)}
                          >
                            {t('admin.reservations.actions.cancel')}
                          </ActionButton>
                        </>
                      )}
                      {reservation.status === 'CONFIRMED' && (
                        <>
                          <ActionButton onClick={() => handleCheckIn(reservation.id)}>
                            {t('admin.reservations.actions.checkIn')}
                          </ActionButton>
                          <ActionButton
                            $variant='delete'
                            onClick={() => handleCancel(reservation.id)}
                          >
                            {t('admin.reservations.actions.cancel')}
                          </ActionButton>
                        </>
                      )}
                      {reservation.status === 'CHECKED_IN' && (
                        <ActionButton onClick={() => handleCheckOut(reservation.id)}>
                          {t('admin.reservations.actions.checkOut')}
                        </ActionButton>
                      )}
                      {['CANCELLED', 'CHECKED_OUT', 'NO_SHOW'].includes(reservation.status) && (
                        <ActionButton
                          $variant='delete'
                          onClick={() => handleDelete(reservation.id)}
                        >
                          {t('admin.reservations.actions.delete')}
                        </ActionButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} style={{ padding: '40px', textAlign: 'center' }}>
                    {t('admin.reservations.table.noReservations')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginTop: '24px',
          }}
        >
          <Button
            $variant='secondary'
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            {t('admin.reservations.pagination.previous')}
          </Button>
          <span style={{ padding: '0 16px' }}>
            {t('admin.reservations.pagination.page', { current: currentPage, total: totalPages })}
          </span>
          <Button
            $variant='secondary'
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            {t('admin.reservations.pagination.next')}
          </Button>
        </div>
      )}
    </Container>
  );
};
