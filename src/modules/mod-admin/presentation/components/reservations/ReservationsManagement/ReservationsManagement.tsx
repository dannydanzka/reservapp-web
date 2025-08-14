'use client';

import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from '@ui/LoadingSpinner';
import { ReservationFilters } from '@services/core/api/reservationsApiService';
import { usePermissions } from '@presentation/hooks/usePermissions';
import { useReservations } from '@presentation/hooks/useReservations';
import { useTranslation } from '@i18n/index';

import type {
  ReservationsManagementProps,
  StatusColorVariant,
} from './ReservationsManagement.interfaces';

import * as S from './ReservationsManagement.styled';

/**
 * Reservations management component for admin interface.
 */
export const ReservationsManagement: React.FC<ReservationsManagementProps> = () => {
  const { t } = useTranslation();
  const { hasRole } = usePermissions();
  const isSuperAdmin = hasRole('SUPER_ADMIN');

  // Use HTTP API hook instead of direct service calls
  const {
    clearError,
    currentPage,
    deleteReservation,
    error,
    filters,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    loadReservations,
    reservations,
    setFilters,
    totalPages,
    totalReservations,
    updateReservationStatus,
  } = useReservations();

  // Local UI state for filters
  const [localFilters, setLocalFilters] = useState<ReservationFilters>({
    status: filters.status || '',
  });

  // Load reservations on component mount
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(localFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters, setFilters]);

  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

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

  const getStatusColor = (status: string): StatusColorVariant => {
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
      const success = await deleteReservation(reservationId);
      if (success) {
        alert(t('admin.reservations.messages.reservationDeleted'));
      } else {
        alert(t('admin.reservations.messages.errorDeleting'));
      }
    }
  };

  const handleCancel = async (reservationId: string) => {
    if (confirm(t('admin.reservations.confirmations.cancelReservation', { id: reservationId }))) {
      const success = await updateReservationStatus(reservationId, 'CANCELLED');
      if (success) {
        alert(t('admin.reservations.messages.reservationCancelled'));
      } else {
        alert(t('admin.reservations.messages.errorCancelling'));
      }
    }
  };

  const handleCheckIn = async (reservationId: string) => {
    const success = await updateReservationStatus(reservationId, 'CHECKED_IN');
    if (success) {
      alert(t('admin.reservations.messages.checkInSuccessful'));
    } else {
      alert(t('admin.reservations.messages.errorCheckIn'));
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    const success = await updateReservationStatus(reservationId, 'CHECKED_OUT');
    if (success) {
      alert(t('admin.reservations.messages.checkOutSuccessful'));
    } else {
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
    <S.Container>
      <S.Header>
        <S.Title>{t('admin.reservations.title')}</S.Title>
        <S.Actions>
          <S.Button $variant='primary' onClick={handleCreateNew}>
            {t('admin.reservations.newReservation')}
          </S.Button>
          <S.Button $variant='secondary' onClick={handleExport}>
            {t('admin.reservations.export')}
          </S.Button>
        </S.Actions>
      </S.Header>

      <S.FilterSection>
        <S.FilterGrid>
          <S.FilterGroup>
            <S.Label htmlFor='status'>{t('admin.reservations.filters.status')}</S.Label>
            <S.Select
              id='status'
              value={localFilters.status || 'all'}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: e.target.value === 'all' ? '' : e.target.value,
                }))
              }
            >
              <option value='all'>{t('admin.reservations.filters.allStatuses')}</option>
              <option value='PENDING'>{t('admin.reservations.status.PENDING')}</option>
              <option value='CONFIRMED'>{t('admin.reservations.status.CONFIRMED')}</option>
              <option value='CHECKED_IN'>{t('admin.reservations.status.CHECKED_IN')}</option>
              <option value='CHECKED_OUT'>{t('admin.reservations.status.CHECKED_OUT')}</option>
              <option value='CANCELLED'>{t('admin.reservations.status.CANCELLED')}</option>
              <option value='NO_SHOW'>{t('admin.reservations.status.NO_SHOW')}</option>
            </S.Select>
          </S.FilterGroup>
        </S.FilterGrid>
      </S.FilterSection>

      <S.TableContainer>
        {isLoading ? (
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
          <S.Table>
            <S.TableHead>
              <tr>
                <S.TableHeader>{t('admin.reservations.table.id')}</S.TableHeader>
                <S.TableHeader>{t('admin.reservations.table.customer')}</S.TableHeader>
                <S.TableHeader>{t('admin.reservations.table.service')}</S.TableHeader>
                <S.TableHeader>{t('admin.reservations.table.venue')}</S.TableHeader>
                {isSuperAdmin && (
                  <S.TableHeader>{t('admin.reservations.table.businessOwner')}</S.TableHeader>
                )}
                <S.TableHeader>{t('admin.reservations.table.checkInOut')}</S.TableHeader>
                <S.TableHeader>{t('admin.reservations.table.status')}</S.TableHeader>
                <S.TableHeader>{t('admin.reservations.table.total')}</S.TableHeader>
                <S.TableHeader>{t('admin.reservations.table.actions')}</S.TableHeader>
              </tr>
            </S.TableHead>
            <S.TableBody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <S.TableRow key={reservation.id}>
                    <S.TableCell>{reservation.id.substring(0, 8)}...</S.TableCell>
                    <S.TableCell>
                      <div>
                        {reservation.user?.firstName} {reservation.user?.lastName}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {reservation.user?.email}
                      </div>
                    </S.TableCell>
                    <S.TableCell>{reservation.service?.name}</S.TableCell>
                    <S.TableCell>
                      <div>{reservation.venue?.name}</div>
                    </S.TableCell>
                    {isSuperAdmin && (
                      <S.TableCell>
                        {reservation.venue?.owner ? (
                          <div>
                            <strong>
                              {reservation.venue.owner.firstName} {reservation.venue.owner.lastName}
                            </strong>
                            {reservation.venue.owner.businessAccount?.businessName && (
                              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                {reservation.venue.owner.businessAccount.businessName}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>Sin propietario</span>
                        )}
                      </S.TableCell>
                    )}
                    <S.TableCell>
                      <div>{formatDate(reservation.checkInDate)}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {formatDate(reservation.checkOutDate)}
                      </div>
                    </S.TableCell>
                    <S.TableCell>
                      <S.StatusBadge $status={getStatusColor(reservation.status)}>
                        {getStatusInSpanish(reservation.status)}
                      </S.StatusBadge>
                    </S.TableCell>
                    <S.TableCell>{formatCurrency(reservation.totalAmount)}</S.TableCell>
                    <S.TableCell>
                      {reservation.status === 'PENDING' && (
                        <>
                          <S.ActionButton onClick={() => handleEdit(reservation.id)}>
                            {t('admin.reservations.actions.edit')}
                          </S.ActionButton>
                          <S.ActionButton
                            $variant='delete'
                            onClick={() => handleCancel(reservation.id)}
                          >
                            {t('admin.reservations.actions.cancel')}
                          </S.ActionButton>
                        </>
                      )}
                      {reservation.status === 'CONFIRMED' && (
                        <>
                          <S.ActionButton onClick={() => handleCheckIn(reservation.id)}>
                            {t('admin.reservations.actions.checkIn')}
                          </S.ActionButton>
                          <S.ActionButton
                            $variant='delete'
                            onClick={() => handleCancel(reservation.id)}
                          >
                            {t('admin.reservations.actions.cancel')}
                          </S.ActionButton>
                        </>
                      )}
                      {reservation.status === 'CHECKED_IN' && (
                        <S.ActionButton onClick={() => handleCheckOut(reservation.id)}>
                          {t('admin.reservations.actions.checkOut')}
                        </S.ActionButton>
                      )}
                      {['CANCELLED', 'CHECKED_OUT', 'NO_SHOW'].includes(reservation.status) && (
                        <S.ActionButton
                          $variant='delete'
                          onClick={() => handleDelete(reservation.id)}
                        >
                          {t('admin.reservations.actions.delete')}
                        </S.ActionButton>
                      )}
                    </S.TableCell>
                  </S.TableRow>
                ))
              ) : (
                <S.TableRow>
                  <S.TableCell
                    colSpan={isSuperAdmin ? 9 : 8}
                    style={{ padding: '40px', textAlign: 'center' }}
                  >
                    {t('admin.reservations.table.noReservations')}
                  </S.TableCell>
                </S.TableRow>
              )}
            </S.TableBody>
          </S.Table>
        )}
      </S.TableContainer>

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
          <S.Button $variant='secondary' disabled={!hasPreviousPage} onClick={goToPreviousPage}>
            {t('admin.reservations.pagination.previous')}
          </S.Button>
          <span style={{ padding: '0 16px' }}>
            {t('admin.reservations.pagination.page', { current: currentPage, total: totalPages })}
          </span>
          <S.Button $variant='secondary' disabled={!hasNextPage} onClick={goToNextPage}>
            {t('admin.reservations.pagination.next')}
          </S.Button>
        </div>
      )}
    </S.Container>
  );
};
