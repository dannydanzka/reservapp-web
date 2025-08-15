'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Search,
  User,
  XCircle,
} from 'lucide-react';

import type {
  DashboardStats,
  ReservationFilters,
  ReservationsDashboardProps,
  ReservationWithPayment,
} from './ReservationsDashboard.interfaces';

import * as S from './ReservationsDashboard.styled';

export const ReservationsDashboard = ({ className }: ReservationsDashboardProps) => {
  const [reservations, setReservations] = useState<ReservationWithPayment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    completedPayments: 0,
    confirmedReservations: 0,
    failedPayments: 0,
    pendingPayments: 0,
    totalReservations: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReservationFilters>({
    dateFrom: '',
    dateTo: '',
    paymentStatus: '',
    search: '',
    status: '',
    venue: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      // This would be replaced with actual API call
      const mockReservations: ReservationWithPayment[] = [
        {
          checkInDate: '2025-01-15T15:00:00Z',
          checkOutDate: '2025-01-16T11:00:00Z',
          confirmationId: 'RSV-001',
          createdAt: '2025-01-10T10:00:00Z',
          guests: 2,
          id: '1',
          payments: [
            {
              amount: 1500,
              createdAt: '2025-01-10T10:00:00Z',
              id: 'p1',
              status: 'COMPLETED',
            },
          ],
          service: {
            id: 's1',
            name: 'Habitación Deluxe',
            venue: {
              id: 'v1',
              name: 'Hotel Paradise',
            },
          },
          status: 'CONFIRMED',
          totalAmount: 1500,
          updatedAt: '2025-01-10T10:00:00Z',
          user: {
            email: 'juan@example.com',
            firstName: 'Juan',
            id: 'u1',
            lastName: 'Pérez',
          },
        },
        {
          checkInDate: '2025-01-20T14:00:00Z',
          checkOutDate: '2025-01-22T12:00:00Z',
          confirmationId: 'RSV-002',
          createdAt: '2025-01-12T14:30:00Z',
          guests: 4,
          id: '2',
          payments: [
            {
              amount: 2800,
              createdAt: '2025-01-12T14:30:00Z',
              id: 'p2',
              status: 'PENDING',
            },
          ],
          service: {
            id: 's2',
            name: 'Suite Familiar',
            venue: {
              id: 'v1',
              name: 'Hotel Paradise',
            },
          },
          status: 'PENDING',
          totalAmount: 2800,
          updatedAt: '2025-01-12T14:30:00Z',
          user: {
            email: 'maria@example.com',
            firstName: 'María',
            id: 'u2',
            lastName: 'González',
          },
        },
      ];

      setReservations(mockReservations);
      setTotalPages(1);

      // Calculate stats
      const totalReservations = mockReservations.length;
      const pendingPayments = mockReservations.filter((r) =>
        r.payments.some((p) => p?.status === 'PENDING' || (p?.status as any) === 'pending')
      ).length;
      const confirmedReservations = mockReservations.filter(
        (r) => r?.status === 'CONFIRMED'
      ).length;
      const completedPayments = mockReservations.filter((r) =>
        r.payments.some((p) => p?.status === 'COMPLETED' || (p?.status as any) === 'completed')
      ).length;
      const failedPayments = mockReservations.filter((r) =>
        r.payments.some((p) => p?.status === 'FAILED' || (p?.status as any) === 'failed')
      ).length;
      const totalRevenue = mockReservations
        .filter((r) =>
          r.payments.some((p) => p?.status === 'COMPLETED' || (p?.status as any) === 'completed')
        )
        .reduce((sum, r) => sum + r.totalAmount, 0);

      setStats({
        completedPayments,
        confirmedReservations,
        failedPayments,
        pendingPayments,
        totalReservations,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    try {
      // API call to update reservation status
      console.log('Updating reservation status:', { newStatus, reservationId });
      // Refresh data after update
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  const handleManualPaymentVerification = async (paymentId: string) => {
    try {
      // API call to manually verify payment
      console.log('Manual payment verification:', paymentId);
      fetchReservations();
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  if (loading) {
    return (
      <S.LoadingContainer>
        <S.LoadingSpinner />
      </S.LoadingContainer>
    );
  }

  return (
    <S.DashboardContainer className={className}>
      <S.HeaderSection>
        <S.HeaderTitle>Dashboard de Reservaciones</S.HeaderTitle>
      </S.HeaderSection>

      {/* Stats Cards */}
      <S.StatsGrid>
        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#2563eb'>
              <Calendar />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Total</S.StatLabel>
              <S.StatValue>{stats.totalReservations}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#059669'>
              <CheckCircle />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Confirmadas</S.StatLabel>
              <S.StatValue>{stats.confirmedReservations}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#d97706'>
              <Clock />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Pagos Pendientes</S.StatLabel>
              <S.StatValue>{stats.pendingPayments}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#059669'>
              <CreditCard />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Pagos Completos</S.StatLabel>
              <S.StatValue>{stats.completedPayments}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#dc2626'>
              <XCircle />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Pagos Fallidos</S.StatLabel>
              <S.StatValue>{stats.failedPayments}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>

        <S.StatCard>
          <S.StatContent>
            <S.StatIcon color='#2563eb'>
              <DollarSign />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatLabel>Ingresos</S.StatLabel>
              <S.StatValue>${stats.totalRevenue.toLocaleString()}</S.StatValue>
            </S.StatInfo>
          </S.StatContent>
        </S.StatCard>
      </S.StatsGrid>

      {/* Filters */}
      <S.FiltersCard>
        <S.FiltersGrid>
          <S.FilterField>
            <S.FilterLabel>Estado de Reservación</S.FilterLabel>
            <S.FilterSelect
              value={filters?.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value=''>Todos los estados</option>
              <option value='PENDING'>Pendiente</option>
              <option value='CONFIRMED'>Confirmada</option>
              <option value='CHECKED_IN'>Check-in</option>
              <option value='CHECKED_OUT'>Check-out</option>
              <option value='CANCELLED'>Cancelada</option>
              <option value='NO_SHOW'>No Show</option>
            </S.FilterSelect>
          </S.FilterField>

          <S.FilterField>
            <S.FilterLabel>Estado de Pago</S.FilterLabel>
            <S.FilterSelect
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            >
              <option value=''>Todos los pagos</option>
              <option value='PENDING'>Pendiente</option>
              <option value='COMPLETED'>Completado</option>
              <option value='FAILED'>Fallido</option>
              <option value='REFUNDED'>Reembolsado</option>
            </S.FilterSelect>
          </S.FilterField>

          <S.FilterField>
            <S.FilterLabel>Venue</S.FilterLabel>
            <S.FilterSelect
              value={filters.venue}
              onChange={(e) => setFilters({ ...filters, venue: e.target.value })}
            >
              <option value=''>Todos los venues</option>
              <option value='v1'>Hotel Paradise</option>
            </S.FilterSelect>
          </S.FilterField>

          <S.FilterField>
            <S.FilterLabel>Fecha Desde</S.FilterLabel>
            <S.FilterInput
              type='date'
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </S.FilterField>

          <S.FilterField>
            <S.FilterLabel>Fecha Hasta</S.FilterLabel>
            <S.FilterInput
              type='date'
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </S.FilterField>

          <S.FilterField>
            <S.FilterLabel>Buscar</S.FilterLabel>
            <S.SearchInputContainer>
              <S.SearchIcon>
                <Search />
              </S.SearchIcon>
              <S.SearchInput
                placeholder='ID, usuario, email...'
                type='text'
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </S.SearchInputContainer>
          </S.FilterField>
        </S.FiltersGrid>
      </S.FiltersCard>

      {/* Reservations Table */}
      <S.TableCard>
        <S.TableContainer>
          <S.Table>
            <S.TableHeader>
              <S.TableHeaderRow>
                <S.TableHeaderCell>Reservación</S.TableHeaderCell>
                <S.TableHeaderCell>Cliente</S.TableHeaderCell>
                <S.TableHeaderCell>Servicio / Venue</S.TableHeaderCell>
                <S.TableHeaderCell>Fechas</S.TableHeaderCell>
                <S.TableHeaderCell>Estado</S.TableHeaderCell>
                <S.TableHeaderCell>Pago</S.TableHeaderCell>
                <S.TableHeaderCell>Total</S.TableHeaderCell>
                <S.TableHeaderCell>Acciones</S.TableHeaderCell>
              </S.TableHeaderRow>
            </S.TableHeader>
            <S.TableBody>
              {reservations.map((reservation) => (
                <S.TableRow key={reservation.id}>
                  <S.TableCellMedium>{reservation.confirmationId}</S.TableCellMedium>

                  <S.TableCell>
                    <S.UserInfo>
                      <S.UserIcon>
                        <User />
                      </S.UserIcon>
                      <S.UserDetails>
                        <S.UserName>
                          {reservation.user.firstName} {reservation.user.lastName}
                        </S.UserName>
                        <S.UserEmail>{reservation.user.email}</S.UserEmail>
                      </S.UserDetails>
                    </S.UserInfo>
                  </S.TableCell>

                  <S.TableCell>
                    <S.ServiceInfo>
                      <S.BuildingIcon>
                        <Building />
                      </S.BuildingIcon>
                      <S.ServiceDetails>
                        <S.ServiceName>{reservation.service.name}</S.ServiceName>
                        <S.VenueName>{reservation.service.venue.name}</S.VenueName>
                      </S.ServiceDetails>
                    </S.ServiceInfo>
                  </S.TableCell>

                  <S.TableCell>
                    <S.DateInfo>
                      <div>Check-in: {new Date(reservation.checkInDate).toLocaleDateString()}</div>
                      <div>
                        Check-out: {new Date(reservation.checkOutDate).toLocaleDateString()}
                      </div>
                    </S.DateInfo>
                  </S.TableCell>

                  <S.TableCell>
                    <S.StatusBadge $statusType={reservation?.status}>
                      {reservation?.status}
                    </S.StatusBadge>
                  </S.TableCell>

                  <S.TableCell>
                    {reservation.payments.map((payment) => (
                      <S.PaymentStatus key={payment.id}>
                        <S.StatusBadge $statusType={payment?.status}>
                          {payment?.status}
                        </S.StatusBadge>
                      </S.PaymentStatus>
                    ))}
                  </S.TableCell>

                  <S.AmountCell>${reservation.totalAmount.toLocaleString()}</S.AmountCell>

                  <S.TableCell>
                    <S.ActionsCell>
                      <S.StatusSelect
                        value={reservation?.status}
                        onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                      >
                        <option value='PENDING'>Pendiente</option>
                        <option value='CONFIRMED'>Confirmar</option>
                        <option value='CHECKED_IN'>Check-in</option>
                        <option value='CHECKED_OUT'>Check-out</option>
                        <option value='CANCELLED'>Cancelar</option>
                        <option value='NO_SHOW'>No Show</option>
                      </S.StatusSelect>

                      {reservation.payments.some(
                        (p) =>
                          p?.status === 'PENDING' ||
                          (p?.status as any) === 'pending' ||
                          p?.status === 'FAILED' ||
                          (p?.status as any) === 'failed'
                      ) && (
                        <S.VerifyButton
                          onClick={() =>
                            handleManualPaymentVerification(reservation.payments[0].id)
                          }
                        >
                          Verificar Pago
                        </S.VerifyButton>
                      )}
                    </S.ActionsCell>
                  </S.TableCell>
                </S.TableRow>
              ))}
            </S.TableBody>
          </S.Table>
        </S.TableContainer>
      </S.TableCard>

      {/* Pagination */}
      {totalPages > 1 && (
        <S.PaginationContainer>
          <S.MobilePagination>
            <S.PaginationButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              Anterior
            </S.PaginationButton>
            <S.PaginationButton
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            >
              Siguiente
            </S.PaginationButton>
          </S.MobilePagination>

          <S.DesktopPagination>
            <S.PaginationInfo>
              Página <span>{currentPage}</span> de <span>{totalPages}</span>
            </S.PaginationInfo>
            <S.PaginationNav>
              <S.PaginationNavButton
                disabled={currentPage === 1}
                position='left'
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Anterior
              </S.PaginationNavButton>
              <S.PaginationNavButton
                disabled={currentPage === totalPages}
                position='right'
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              >
                Siguiente
              </S.PaginationNavButton>
            </S.PaginationNav>
          </S.DesktopPagination>
        </S.PaginationContainer>
      )}
    </S.DashboardContainer>
  );
};
