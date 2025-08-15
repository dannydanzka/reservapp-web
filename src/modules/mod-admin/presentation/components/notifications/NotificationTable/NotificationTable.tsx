'use client';

import { useState } from 'react';

import {
  Bell,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Monitor,
  MoreVertical,
  X,
} from 'lucide-react';

import type { AdminNotification } from '@mod-admin/infrastructure/services/admin/adminNotificationService';
import { Badge } from '@ui/Badge';
import { Button } from '@ui/Button';
import { useTranslation } from '@i18n/index';

import type {
  NotificationTableProps,
  NotificationTypeConfig,
} from './NotificationTable.interfaces';

import * as S from './NotificationTable.styled';

const TYPE_CONFIG: Record<string, NotificationTypeConfig> = {
  BUSINESS_REGISTERED: {
    color: 'success',
    icon: '🏢',
    label: 'Negocio Registrado',
  },
  CONTACT_FORM: {
    color: 'primary',
    icon: '�',
    label: 'Formulario Contacto',
  },
  PAYMENT_FAILED: {
    color: 'error',
    icon: '💳',
    label: 'Pago Fallido',
  },
  PAYMENT_RECEIVED: {
    color: 'success',
    icon: '💰',
    label: 'Pago Recibido',
  },
  RESERVATION_CANCELLED: {
    color: 'error',
    icon: '❌',
    label: 'Reserva Cancelada',
  },
  RESERVATION_CREATED: {
    color: 'warning',
    icon: '📅',
    label: 'Reserva Creada',
  },
  SERVICE_CREATED: {
    color: 'success',
    icon: '⭐',
    label: 'Servicio Creado',
  },
  SYSTEM_ALERT: {
    color: 'warning',
    icon: '⚠️',
    label: 'Alerta Sistema',
  },
  USER_REGISTERED: {
    color: 'primary',
    icon: '�',
    label: 'Usuario Registrado',
  },
  VENUE_CREATED: {
    color: 'success',
    icon: '🏨',
    label: 'Venue Creado',
  },
};

export const NotificationTable = ({
  isRefreshing = false,
  loading,
  notifications,
  onBulkAction,
  onClearSelection,
  onMarkAsRead,
  onMarkAsUnread,
  onNotificationSelect,
  onPageChange,
  onSelectAll,
  pagination,
  selectedNotifications,
}: NotificationTableProps) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // Format functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `hace ${diffMins} min`;
    } else if (diffHours < 24) {
      return `hace ${diffHours}h`;
    } else if (diffDays < 7) {
      return `hace ${diffDays}d`;
    } else {
      return formatDate(dateString);
    }
  };

  // Handle individual notification actions
  const handleNotificationAction = (notification: AdminNotification, action: 'read' | 'unread') => {
    setShowMenu(null);
    if (action === 'read') {
      onMarkAsRead([notification.id]);
    } else {
      onMarkAsUnread([notification.id]);
    }
  };

  // Handle bulk selection
  const isAllSelected =
    notifications.length > 0 && selectedNotifications.length === notifications.length;
  const isPartiallySelected =
    selectedNotifications.length > 0 && selectedNotifications.length < notifications.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection();
    } else {
      onSelectAll();
    }
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      onPageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      onPageChange(pagination.page + 1);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <S.EmptyStateContainer>
        <S.EmptyIcon>
          <Bell />
        </S.EmptyIcon>
        <S.EmptyTitle>Cargando notificaciones...</S.EmptyTitle>
        <S.EmptyDescription>
          Por favor espera mientras cargamos las notificaciones.
        </S.EmptyDescription>
      </S.EmptyStateContainer>
    );
  }

  if (!loading && notifications.length === 0) {
    return (
      <S.EmptyStateContainer>
        <S.EmptyIcon>
          <Bell />
        </S.EmptyIcon>
        <S.EmptyTitle>No hay notificaciones</S.EmptyTitle>
        <S.EmptyDescription>
          No se encontraron notificaciones que coincidan con los filtros aplicados.
        </S.EmptyDescription>
      </S.EmptyStateContainer>
    );
  }

  return (
    <S.TableContainer>
      {/* Bulk Actions Bar */}
      {selectedNotifications.length > 0 && (
        <S.BulkActionsBar>
          <S.BulkActionsLeft>
            <S.BulkActionsText>
              {selectedNotifications.length} notificación(es) seleccionada(s)
            </S.BulkActionsText>
          </S.BulkActionsLeft>
          <S.BulkActionsRight>
            <S.ActionButton
              size='small'
              variant='outlined'
              onClick={() => onBulkAction('read', selectedNotifications)}
            >
              <Check className='w-4 h-4' />
              Marcar como leídas
            </S.ActionButton>
            <S.ActionButton
              size='small'
              variant='outlined'
              onClick={() => onBulkAction('unread', selectedNotifications)}
            >
              <Eye className='w-4 h-4' />
              Marcar como no leídas
            </S.ActionButton>
            <S.ActionButton size='small' variant='text' onClick={onClearSelection}>
              <X className='w-4 h-4' />
              Cancelar
            </S.ActionButton>
          </S.BulkActionsRight>
        </S.BulkActionsBar>
      )}

      {/* Table */}
      <S.TableWrapper>
        <S.Table>
          <S.TableHeader>
            <S.TableHeaderRow>
              <S.TableHeaderCell>
                <S.Checkbox
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  type='checkbox'
                  onChange={handleSelectAll}
                />
              </S.TableHeaderCell>
              <S.TableHeaderCell>Notificación</S.TableHeaderCell>
              <S.TableHeaderCell>Usuario</S.TableHeaderCell>
              <S.TableHeaderCell>Venue</S.TableHeaderCell>
              <S.TableHeaderCell>Fecha</S.TableHeaderCell>
              <S.TableHeaderCell align='right'>Acciones</S.TableHeaderCell>
            </S.TableHeaderRow>
          </S.TableHeader>
          <S.TableBody>
            {notifications.map((notification) => {
              const typeConfig = TYPE_CONFIG[notification.type] || TYPE_CONFIG.SYSTEM_ALERT;
              const isSelected = selectedNotifications.includes(notification.id);

              return (
                <S.TableRow
                  isRefreshing={isRefreshing}
                  isSelected={isSelected}
                  key={notification.id}
                >
                  {/* Checkbox */}
                  <S.CheckboxCell>
                    <S.Checkbox
                      checked={isSelected}
                      type='checkbox'
                      onChange={() => onNotificationSelect(notification.id)}
                    />
                  </S.CheckboxCell>

                  {/* Notification Content */}
                  <S.NotificationCell>
                    <S.NotificationContent>
                      <S.NotificationTitle isRead={notification.isRead}>
                        {notification.title}
                      </S.NotificationTitle>
                      <S.NotificationMessage isRead={notification.isRead}>
                        {notification.message}
                      </S.NotificationMessage>
                      <S.NotificationMeta>
                        <S.TypeBadge type={notification.type}>
                          {typeConfig.icon} {typeConfig.label}
                        </S.TypeBadge>
                        <S.EmailIndicator emailSent={notification.emailSent}>
                          {notification.emailSent ? (
                            <>
                              <Mail className='w-3 h-3' />
                              Email
                            </>
                          ) : (
                            <>
                              <Monitor className='w-3 h-3' />
                              Sistema
                            </>
                          )}
                        </S.EmailIndicator>
                        {notification.emailType && (
                          <Badge variant='secondary'>{notification.emailType}</Badge>
                        )}
                      </S.NotificationMeta>
                    </S.NotificationContent>
                  </S.NotificationCell>

                  {/* User */}
                  <S.TableCell>
                    {notification.user ? (
                      <S.UserInfo>
                        <S.UserName isRead={notification.isRead}>
                          {notification.user.firstName} {notification.user.lastName}
                        </S.UserName>
                        <S.UserEmail>{notification.user.email}</S.UserEmail>
                      </S.UserInfo>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '13px' }}>-</span>
                    )}
                  </S.TableCell>

                  {/* Venue */}
                  <S.TableCell>
                    {notification.venue ? (
                      <S.VenueInfo>
                        <S.VenueName isRead={notification.isRead}>
                          {notification.venue.name}
                        </S.VenueName>
                        <S.VenueCategory>{notification.venue.category}</S.VenueCategory>
                      </S.VenueInfo>
                    ) : notification.service?.venue ? (
                      <S.VenueInfo>
                        <S.VenueName isRead={notification.isRead}>
                          {notification.service.venue.name}
                        </S.VenueName>
                        <S.VenueCategory>vía {notification.service.name}</S.VenueCategory>
                      </S.VenueInfo>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '13px' }}>-</span>
                    )}
                  </S.TableCell>

                  {/* Date */}
                  <S.DateCell>
                    <S.DateText isRead={notification.isRead}>
                      {formatRelativeTime(notification.createdAt)}
                    </S.DateText>
                  </S.DateCell>

                  {/* Actions */}
                  <S.ActionsCell>
                    <S.ActionsContainer>
                      <Button
                        disabled={isRefreshing}
                        size='small'
                        variant='text'
                        onClick={() =>
                          setShowMenu(showMenu === notification.id ? null : notification.id)
                        }
                      >
                        <MoreVertical className='w-4 h-4' />
                      </Button>

                      {showMenu === notification.id && (
                        <S.ActionsMenu>
                          <S.ActionsMenuContent>
                            {notification.isRead ? (
                              <S.ActionButton
                                variant='text'
                                onClick={() => handleNotificationAction(notification, 'unread')}
                              >
                                <EyeOff className='w-4 h-4' />
                                Marcar como no leída
                              </S.ActionButton>
                            ) : (
                              <S.ActionButton
                                variant='text'
                                onClick={() => handleNotificationAction(notification, 'read')}
                              >
                                <CheckCircle className='w-4 h-4' />
                                Marcar como leída
                              </S.ActionButton>
                            )}

                            {notification.reservation && (
                              <S.ActionButton
                                variant='text'
                                onClick={() => {
                                  window.open(
                                    `/admin/reservations/${notification.reservation?.id}`,
                                    '_blank'
                                  );
                                  setShowMenu(null);
                                }}
                              >
                                <Eye className='w-4 h-4' />
                                Ver reserva
                              </S.ActionButton>
                            )}

                            {notification.venue && (
                              <S.ActionButton
                                variant='text'
                                onClick={() => {
                                  window.open(`/admin/venues/${notification.venue?.id}`, '_blank');
                                  setShowMenu(null);
                                }}
                              >
                                <Eye className='w-4 h-4' />
                                Ver venue
                              </S.ActionButton>
                            )}
                          </S.ActionsMenuContent>
                        </S.ActionsMenu>
                      )}
                    </S.ActionsContainer>
                  </S.ActionsCell>
                </S.TableRow>
              );
            })}
          </S.TableBody>
        </S.Table>
      </S.TableWrapper>

      {/* Pagination */}
      <S.PaginationContainer>
        <S.PaginationInfo>
          Mostrando <span>{(pagination.page - 1) * pagination.limit + 1}</span> a{' '}
          <span>{Math.min(pagination.page * pagination.limit, pagination.total)}</span> de{' '}
          <span>{pagination.total}</span> notificaciones
        </S.PaginationInfo>

        <S.PaginationControls>
          <Button
            disabled={pagination.page <= 1 || isRefreshing}
            variant='outlined'
            onClick={handlePreviousPage}
          >
            Anterior
          </Button>

          <S.PaginationText>
            Página {pagination.page} de {pagination.totalPages}
          </S.PaginationText>

          <Button
            disabled={!pagination.hasNext || isRefreshing}
            variant='outlined'
            onClick={handleNextPage}
          >
            Siguiente
          </Button>
        </S.PaginationControls>
      </S.PaginationContainer>

      {/* Click outside to close menu */}
      {showMenu && <S.MenuOverlay onClick={() => setShowMenu(null)} />}
    </S.TableContainer>
  );
};
