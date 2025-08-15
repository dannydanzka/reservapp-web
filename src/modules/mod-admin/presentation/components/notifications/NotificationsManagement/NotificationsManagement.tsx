'use client';

import React, { useEffect, useState } from 'react';

import {
  type AdminNotification,
  adminNotificationService,
  type NotificationFilters,
} from '@mod-admin/infrastructure/services/admin/adminNotificationService';
import { LoadingSpinner } from '@ui/LoadingSpinner';
import { usePermissions } from '@presentation/hooks/usePermissions';

import type { NotificationsManagementProps } from './NotificationsManagement.interfaces';

import * as S from './NotificationsManagement.styled';

/**
 * Notifications management component for admin interface.
 * Connected to real API with full CRUD functionality following project standards.
 */
export const NotificationsManagement: React.FC<NotificationsManagementProps> = () => {
  // State for notifications data
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [limit] = useState(20);

  // Removed filters state for simpler interface

  // Selection state for bulk operations
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const { hasRole } = usePermissions();
  const isSuperAdmin = hasRole('SUPER_ADMIN');

  // Function to translate notification types
  const translateNotificationType = (type: string): string => {
    const translations: Record<string, string> = {
      BUSINESS_REGISTERED: 'Negocio Registrado',
      CONTACT_FORM: 'Formulario de Contacto',
      PAYMENT_FAILED: 'Pago Fallido',
      PAYMENT_RECEIVED: 'Pago Recibido',
      RESERVATION_CANCELLED: 'Reserva Cancelada',
      RESERVATION_CONFIRMATION: 'Reserva Confirmada',
      RESERVATION_CREATED: 'Reserva Creada',
      SERVICE_CREATED: 'Servicio Creado',
      SYSTEM_ALERT: 'Alerta del Sistema',
      USER_REGISTERED: 'Usuario Registrado',
      VENUE_CREATED: 'Venue Creado',
    };
    return translations[type] || type.replace('_', ' ');
  };

  // Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminNotificationService.getNotifications({
        limit,
        page: currentPage,
      });

      if (response.success) {
        setNotifications(response.data.notifications);
        setTotalPages(response.data.pagination.totalPages);
        setTotalNotifications(response.data.pagination.total);
      } else {
        throw new Error('Failed to load notifications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  // Effect to load data on mount and when dependencies change
  useEffect(() => {
    loadNotifications();
  }, [currentPage]);

  // Filters removed for simpler interface

  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle selection
  const handleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((notifId) => notifId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map((n) => n.id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'read' | 'unread') => {
    try {
      setError(null);
      const response = await adminNotificationService.bulkUpdateNotifications({
        isRead: action === 'read',
        notificationIds: selectedNotifications,
      });

      if (response.success) {
        await loadNotifications(); // Refresh data
        setSelectedNotifications([]); // Clear selection
      } else {
        throw new Error('Bulk action failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk action failed');
    }
  };

  // Filters removed for simpler interface

  return (
    <S.Container>
      <S.Header>
        <S.Title>Gestión de Notificaciones</S.Title>
        <S.Subtitle>Administra las notificaciones del sistema</S.Subtitle>
      </S.Header>

      {/* Filters section removed for simpler interface */}

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <S.BulkActionsBar>
          <S.BulkActionsInfo>{selectedNotifications.length} seleccionadas</S.BulkActionsInfo>
          <S.BulkActionsButtons>
            <S.BulkActionButton variant='primary' onClick={() => handleBulkAction('read')}>
              Marcar como leídas
            </S.BulkActionButton>
            <S.BulkActionButton variant='secondary' onClick={() => handleBulkAction('unread')}>
              Marcar como no leídas
            </S.BulkActionButton>
          </S.BulkActionsButtons>
        </S.BulkActionsBar>
      )}

      {/* Content */}
      <S.Content>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        {loading && (
          <S.LoadingContainer>
            <LoadingSpinner size='large' />
            <S.LoadingText>Cargando notificaciones...</S.LoadingText>
          </S.LoadingContainer>
        )}

        {!loading && notifications.length === 0 && (
          <S.EmptyState>
            <S.EmptyIcon>🔔</S.EmptyIcon>
            <S.EmptyTitle>No hay notificaciones</S.EmptyTitle>
            <S.EmptyMessage>No hay notificaciones en el sistema.</S.EmptyMessage>
          </S.EmptyState>
        )}

        {!loading && notifications.length > 0 && (
          <>
            {/* Notifications Table */}
            <S.Table>
              <S.TableHeader>
                <S.TableRow>
                  <S.TableHeaderCell>
                    <S.Checkbox
                      checked={selectedNotifications.length === notifications.length}
                      type='checkbox'
                      onChange={handleSelectAll}
                    />
                  </S.TableHeaderCell>
                  <S.TableHeaderCell>Tipo</S.TableHeaderCell>
                  <S.TableHeaderCell>Mensaje</S.TableHeaderCell>
                  <S.TableHeaderCell>Usuario</S.TableHeaderCell>
                  <S.TableHeaderCell>Fecha</S.TableHeaderCell>
                  <S.TableHeaderCell>Estado</S.TableHeaderCell>
                </S.TableRow>
              </S.TableHeader>
              <S.TableBody>
                {notifications.map((notification) => (
                  <S.TableRow $isRead={notification.isRead} key={notification.id}>
                    <S.TableCell>
                      <S.Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        type='checkbox'
                        onChange={() => handleSelectNotification(notification.id)}
                      />
                    </S.TableCell>
                    <S.TableCell>
                      <S.NotificationTypeChip type={notification.type}>
                        {translateNotificationType(notification.type)}
                      </S.NotificationTypeChip>
                    </S.TableCell>
                    <S.TableCell>
                      <S.NotificationContent>
                        <S.NotificationTitle $isRead={notification.isRead}>
                          {notification.title}
                        </S.NotificationTitle>
                        <S.NotificationMessage>{notification.message}</S.NotificationMessage>
                      </S.NotificationContent>
                    </S.TableCell>
                    <S.TableCell>
                      {notification.user ? (
                        <S.UserInfo>
                          <S.UserName>
                            {notification.user.firstName} {notification.user.lastName}
                          </S.UserName>
                          <S.UserEmail>{notification.user.email}</S.UserEmail>
                        </S.UserInfo>
                      ) : (
                        <S.NoData>-</S.NoData>
                      )}
                    </S.TableCell>
                    <S.TableCell>
                      <S.DateInfo>
                        {new Date(notification.createdAt).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </S.DateInfo>
                    </S.TableCell>
                    <S.TableCell>
                      <S.StatusBadge $isRead={notification.isRead}>
                        {notification.isRead ? 'Leída' : 'No leída'}
                      </S.StatusBadge>
                    </S.TableCell>
                  </S.TableRow>
                ))}
              </S.TableBody>
            </S.Table>

            {/* Pagination */}
            <S.PaginationContainer>
              <S.PaginationInfo>
                Mostrando {(currentPage - 1) * limit + 1} -{' '}
                {Math.min(currentPage * limit, totalNotifications)} de {totalNotifications}{' '}
                notificaciones
              </S.PaginationInfo>

              <S.PaginationControls>
                <S.PaginationButton disabled={currentPage <= 1} onClick={goToPreviousPage}>
                  Anterior
                </S.PaginationButton>

                <S.PageInfo>
                  Página {currentPage} de {totalPages}
                </S.PageInfo>

                <S.PaginationButton disabled={currentPage >= totalPages} onClick={goToNextPage}>
                  Siguiente
                </S.PaginationButton>
              </S.PaginationControls>
            </S.PaginationContainer>
          </>
        )}
      </S.Content>
    </S.Container>
  );
};
