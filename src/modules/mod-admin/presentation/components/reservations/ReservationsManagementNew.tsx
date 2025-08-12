'use client';

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button } from '@ui/Button';
import { LoadingSpinner } from '@ui/LoadingSpinner';
import { ReservationEventHandlers } from '@mod-admin/infrastructure/services/notification/reservationEventHandlers';
import { useModalAlert } from '@providers/ModalAlertProvider';
import { useTranslation } from '@i18n/index';
import { useUnifiedNotifications } from '@presentation/hooks/useUnifiedNotifications';

import { ReservationFormModal } from './ReservationFormModal';

// Mock data and types - in real app this would come from API
interface ReservationData {
  id: string;
  userId: string;
  serviceId: string;
  userName: string;
  serviceName: string;
  venueName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  totalAmount: number;
  specialRequests?: string;
  createdAt: string;
}

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary[600]};
`;

const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary[700]};
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  overflow: hidden;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

const TableHeader = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary[700]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[25]};
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[100]};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary[900]};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'CONFIRMED':
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'PENDING':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'CANCELLED':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      case 'CHECKED_OUT':
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
      case 'CHECKED_IN':
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
      case 'NO_SHOW':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      default:
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          
          &:hover {
            background-color: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          
          &:hover {
            background-color: ${theme.colors.error[700]};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.white};
          color: ${theme.colors.secondary[700]};
          border: 1px solid ${theme.colors.secondary[300]};
          
          &:hover {
            background-color: ${theme.colors.secondary[50]};
          }
        `;
    }
  }}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;

  h3 {
    color: ${({ theme }) => theme.colors.secondary[600]};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${({ theme }) => theme.colors.secondary[500]};
    margin-bottom: 1.5rem;
  }
`;

// Mock data for demonstration
const mockReservations: ReservationData[] = [
  {
    checkIn: '2024-12-20T15:00:00Z',
    checkOut: '2024-12-22T11:00:00Z',
    createdAt: '2024-12-15T10:30:00Z',
    guestCount: 2,
    id: 'res_001',
    paymentStatus: 'PAID',
    serviceId: 'service_001',
    serviceName: 'Suite Premium',
    specialRequests: 'Vista al jardín preferible',
    status: 'CONFIRMED',
    totalAmount: 4500.0,
    userId: 'user_001',
    userName: 'Juan Pérez',
    venueName: 'Hotel Boutique Casa Salazar',
  },
  {
    checkIn: '2024-12-18T14:00:00Z',
    checkOut: '2024-12-18T15:30:00Z',
    createdAt: '2024-12-14T16:45:00Z',
    guestCount: 1,
    id: 'res_002',
    paymentStatus: 'PENDING',
    serviceId: 'service_002',
    serviceName: 'Masaje Relajante',
    status: 'PENDING',
    totalAmount: 1200.0,
    userId: 'user_002',
    userName: 'María González',
    venueName: 'Spa Zen Garden',
  },
  // Add more mock data...
];

// Mock user data for notifications (in real app this comes from user API)
const mockUsers = {
  user_001: { email: 'carlos.rodriguez@email.com', name: 'Carlos Rodríguez' },
  user_002: { email: 'ana.garcia@email.com', name: 'Ana García' },
  user_003: { email: 'luis.martin@email.com', name: 'Luis Martín' },
};

// Mock admin data (in real app this comes from auth context)
const mockAdmin = {
  email: 'admin@reservapp.com',
  name: 'Administrador ReservApp',
  userId: 'admin_001',
};

export const ReservationsManagement: React.FC = () => {
  const { t } = useTranslation();
  const { showModalAlert } = useModalAlert();
  const { loading: notificationsLoading } = useUnifiedNotifications();

  // Placeholder functions for missing methods
  const sendAdminAlert = (...args: any[]) => Promise.resolve();
  const sendReservationCancellation = (...args: any[]) => Promise.resolve();
  const sendReservationConfirmation = (...args: any[]) => Promise.resolve();

  // State
  const [reservations, setReservations] = useState<ReservationData[]>(mockReservations);
  const [filteredReservations, setFilteredReservations] =
    useState<ReservationData[]>(mockReservations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<ReservationData | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Load reservations
  useEffect(() => {
    loadReservations();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [reservations, statusFilter, paymentFilter, searchTerm, dateFrom, dateTo]);

  const loadReservations = async () => {
    setIsLoading(true);
    try {
      // In real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      setReservations(mockReservations);
      setError(null);
    } catch (err) {
      setError('Error al cargar las reservas');
      console.error('Error loading reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reservations];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((res) => res?.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter((res) => res.paymentStatus === paymentFilter);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (res) =>
          res.userName.toLowerCase().includes(search) ||
          res.serviceName.toLowerCase().includes(search) ||
          res.venueName.toLowerCase().includes(search) ||
          res.id.toLowerCase().includes(search)
      );
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter((res) => new Date(res.checkIn) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter((res) => new Date(res.checkOut) <= new Date(dateTo));
    }

    setFilteredReservations(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Statistics
  const stats = {
    confirmed: reservations.filter((r) => r?.status === 'CONFIRMED').length,
    pending: reservations.filter((r) => r?.status === 'PENDING' || (r?.status as any) === 'pending')
      .length,
    revenue: reservations
      .filter((r) => r?.paymentStatus === 'PAID')
      .reduce((sum, r) => sum + r?.totalAmount, 0),
    total: reservations.length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReservations = filteredReservations.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleCreateNew = () => {
    setModalMode('create');
    setEditingReservation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (reservation: ReservationData) => {
    setModalMode('edit');
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleReservationSubmit = async (data: any) => {
    try {
      if (modalMode === 'edit' && editingReservation) {
        // Update existing reservation
        const updatedReservations = reservations.map((res) =>
          res.id === editingReservation.id ? { ...res, ...data } : res
        );
        setReservations(updatedReservations);
        showModalAlert({
          message: 'Reserva actualizada exitosamente',
          title: 'Éxito',
        });
      } else {
        // Create new reservation
        const newReservation: ReservationData = {
          ...data,
          createdAt: new Date().toISOString(),
          id: `res_${Date.now()}`,
          serviceName: `Servicio ${data.serviceId}`,
          userName: `Usuario ${data.userId}`,
          venueName: 'Venue por definir',
        };

        // Update local state first
        setReservations([newReservation, ...reservations]);

        // Send notifications when new reservation is created
        try {
          const userData = mockUsers[data.userId as keyof typeof mockUsers] || {
            email: 'user@example.com',
            name: 'Usuario Desconocido',
          };

          // Send confirmation to user + notification in app
          await sendReservationConfirmation({
            checkInDate: data.checkIn,
            checkOutDate: data.checkOut,
            confirmationCode: `CONF-${newReservation.id.slice(-6).toUpperCase()}`,
            currency: 'MXN',
            guestEmail: userData.email,
            guestName: userData.name,
            reservationId: newReservation.id,
            serviceName: newReservation.serviceName,
            serviceNumber: '001',
            specialRequests: data.specialRequests,
            totalAmount: data.totalAmount,
            userId: data.userId,
            venueName: newReservation.venueName,
          });

          console.log(`🎉 Notificaciones enviadas para reserva ${newReservation.id}:`);
          console.log(`  ✅ Email de confirmación → ${userData.email}`);
          console.log(`  ✅ Notificación in-app → Usuario ${data.userId}`);
        } catch (notificationError) {
          console.error('Error enviando notificaciones:', notificationError);
          // No fallar la creación de reserva si las notificaciones fallan
          showModalAlert({
            message: 'Reserva creada, pero hubo un problema enviando las notificaciones',
            title: 'Advertencia',
          });
        }

        showModalAlert({
          message: 'Reserva creada exitosamente - Cliente notificado por email y app',
          title: 'Éxito',
        });
      }
    } catch (error) {
      showModalAlert({
        message: 'Error al procesar la reserva',
        title: 'Error',
      });
    }
  };

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      const reservation = reservations.find((res) => res.id === reservationId);
      if (!reservation) return;

      const updatedReservations = reservations.map((res) =>
        res.id === reservationId ? { ...res, status: newStatus as any } : res
      );
      setReservations(updatedReservations);

      // Send notifications based on status change
      const userData = mockUsers[reservation.userId as keyof typeof mockUsers] || {
        email: 'user@example.com',
        name: 'Usuario Desconocido',
      };

      if (newStatus === 'CONFIRMED' && reservation.status !== 'CONFIRMED') {
        // Send confirmation notification
        try {
          await sendReservationConfirmation({
            checkInDate: reservation.checkIn,
            checkOutDate: reservation.checkOut,
            confirmationCode: `CONF-${reservation.id.slice(-6).toUpperCase()}`,
            currency: 'MXN',
            guestEmail: userData.email,
            guestName: userData.name,
            reservationId: reservation.id,
            serviceName: reservation.serviceName,
            serviceNumber: '001',
            specialRequests: reservation.specialRequests,
            totalAmount: reservation.totalAmount,
            userId: reservation.userId,
            venueName: reservation.venueName,
          });

          console.log(`✅ Confirmación enviada para reserva ${reservationId}`);
          showModalAlert({
            message: 'Reserva confirmada - Cliente notificado por email y app',
            title: 'Éxito',
          });
        } catch (notificationError) {
          console.error('Error enviando confirmación:', notificationError);
          showModalAlert({
            message: 'Estado actualizado, pero hubo un problema enviando la confirmación',
            title: 'Advertencia',
          });
        }
      } else if (newStatus === 'CANCELLED') {
        // Send cancellation notification
        try {
          await sendReservationCancellation({
            checkInDate: reservation.checkIn,
            checkOutDate: reservation.checkOut,
            currency: 'MXN',
            guestEmail: userData.email,
            guestName: userData.name,
            reservationId: reservation.id,
            serviceName: reservation.serviceName,
            serviceNumber: '001',
            totalAmount: reservation.totalAmount,
            userId: reservation.userId,
            venueName: reservation.venueName,
          });

          console.log(`🚫 Cancelación enviada para reserva ${reservationId}`);
          showModalAlert({
            message: 'Reserva cancelada - Cliente notificado por email y app',
            title: 'Éxito',
          });
        } catch (notificationError) {
          console.error('Error enviando cancelación:', notificationError);
          showModalAlert({
            message:
              'Estado actualizado, pero hubo un problema enviando la notificación de cancelación',
            title: 'Advertencia',
          });
        }
      } else {
        showModalAlert({
          message: 'Estado actualizado exitosamente',
          title: 'Éxito',
        });
      }
    } catch (error) {
      showModalAlert({
        message: 'Error al cambiar el estado',
        title: 'Error',
      });
    }
  };

  const handleDelete = async (reservationId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      try {
        const updatedReservations = reservations.filter((res) => res.id !== reservationId);
        setReservations(updatedReservations);
        showModalAlert({
          message: 'Reserva eliminada exitosamente',
          title: 'Éxito',
        });
      } catch (error) {
        showModalAlert({
          message: 'Error al eliminar la reserva',
          title: 'Error',
        });
      }
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPaymentFilter('all');
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      currency: 'MXN',
      style: 'currency',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Container>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            height: '400px',
            justifyContent: 'center',
          }}
        >
          <LoadingSpinner size='large' />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Gestión de Reservas</Title>
        <Actions>
          <Button color='primary' variant='contained' onClick={handleCreateNew}>
            + Nueva Reserva
          </Button>
          <Button color='secondary' variant='outlined' onClick={loadReservations}>
            🔄 Actualizar
          </Button>
        </Actions>
      </Header>

      {/* Statistics */}
      <StatsContainer>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Reservas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.confirmed}</StatValue>
          <StatLabel>Confirmadas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pendientes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatCurrency(stats.revenue)}</StatValue>
          <StatLabel>Ingresos Pagados</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Filters */}
      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <Label>Estado de Reserva</Label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value='all'>Todos los estados</option>
              <option value='PENDING'>Pendiente</option>
              <option value='CONFIRMED'>Confirmada</option>
              <option value='CHECKED_IN'>Check-in</option>
              <option value='CHECKED_OUT'>Check-out</option>
              <option value='NO_SHOW'>No Show</option>
              <option value='CANCELLED'>Cancelada</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Estado de Pago</Label>
            <Select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value='all'>Todos los pagos</option>
              <option value='PENDING'>Pago Pendiente</option>
              <option value='PAID'>Pagado</option>
              <option value='FAILED'>Pago Fallido</option>
              <option value='REFUNDED'>Reembolsado</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Buscar</Label>
            <Input
              placeholder='Cliente, servicio, venue...'
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Desde</Label>
            <Input type='date' value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </FilterGroup>

          <FilterGroup>
            <Label>Hasta</Label>
            <Input type='date' value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </FilterGroup>

          <FilterGroup style={{ justifyContent: 'flex-end', paddingTop: '1.5rem' }}>
            <Button color='secondary' variant='outlined' onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      {/* Table */}
      {currentReservations.length > 0 ? (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Cliente</TableHeader>
                  <TableHeader>Servicio</TableHeader>
                  <TableHeader>Venue</TableHeader>
                  <TableHeader>Check-in</TableHeader>
                  <TableHeader>Check-out</TableHeader>
                  <TableHeader>Huéspedes</TableHeader>
                  <TableHeader>Estado</TableHeader>
                  <TableHeader>Pago</TableHeader>
                  <TableHeader>Total</TableHeader>
                  <TableHeader>Acciones</TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {currentReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <strong>{reservation.id}</strong>
                    </TableCell>
                    <TableCell>{reservation.userName}</TableCell>
                    <TableCell>{reservation.serviceName}</TableCell>
                    <TableCell>{reservation.venueName}</TableCell>
                    <TableCell>{formatDate(reservation.checkIn)}</TableCell>
                    <TableCell>{formatDate(reservation.checkOut)}</TableCell>
                    <TableCell>{reservation.guestCount}</TableCell>
                    <TableCell>
                      <StatusBadge $status={reservation.status}>{reservation.status}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge $status={reservation.paymentStatus}>
                        {reservation.paymentStatus}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <strong>{formatCurrency(reservation.totalAmount)}</strong>
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <ActionButton $variant='secondary' onClick={() => handleEdit(reservation)}>
                          ✏️
                        </ActionButton>
                        {(reservation.status === 'PENDING' ||
                          (reservation.status as any) === 'pending') && (
                          <ActionButton
                            $variant='primary'
                            onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')}
                          >
                            ✅
                          </ActionButton>
                        )}
                        <ActionButton
                          $variant='danger'
                          onClick={() => handleDelete(reservation.id)}
                        >
                          🗑️
                        </ActionButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationContainer>
              <Button
                color='secondary'
                disabled={currentPage === 1}
                variant='outlined'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                ← Anterior
              </Button>
              <PaginationInfo>
                Página {currentPage} de {totalPages}({filteredReservations.length} reservas)
              </PaginationInfo>
              <Button
                color='secondary'
                disabled={currentPage === totalPages}
                variant='outlined'
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Siguiente →
              </Button>
            </PaginationContainer>
          )}
        </>
      ) : (
        <EmptyState>
          <h3>No se encontraron reservas</h3>
          <p>No hay reservas que coincidan con los filtros aplicados.</p>
          <Button color='primary' variant='contained' onClick={clearFilters}>
            Mostrar todas las reservas
          </Button>
        </EmptyState>
      )}

      {/* Reservation Form Modal */}
      <ReservationFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        reservation={editingReservation}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReservationSubmit}
      />
    </Container>
  );
};
