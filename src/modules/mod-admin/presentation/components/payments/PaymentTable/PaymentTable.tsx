'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  MoreVertical,
  RefreshCw,
  RotateCcw,
  XCircle,
} from 'lucide-react';

import { AdminPaymentAction, AdminPaymentView, PaymentStatus } from '@shared/types/admin.types';
import { Badge } from '@ui/Badge';
import { Button } from '@ui/Button';
import { useTranslation } from '@i18n/index';

import { PaymentActionModal } from '../PaymentActionModal';
import type { PaymentTableProps, StatusConfig } from './PaymentTable.interfaces';

import * as S from './PaymentTable.styled';

const STATUS_CONFIG: Record<PaymentStatus, StatusConfig> = {
  cancelled: {
    color: 'secondary',
    icon: XCircle,
    label: 'Cancelado',
  },
  completed: {
    color: 'primary',
    icon: CheckCircle,
    label: 'Completado',
  },
  failed: {
    color: 'error',
    icon: XCircle,
    label: 'Fallido',
  },
  partially_refunded: {
    color: 'secondary',
    icon: RotateCcw,
    label: 'Parcialmente Reembolsado',
  },
  pending: {
    color: 'secondary',
    icon: Clock,
    label: 'Pendiente',
  },
  processing: {
    color: 'primary',
    icon: RefreshCw,
    label: 'Procesando',
  },
  refunded: {
    color: 'secondary',
    icon: RotateCcw,
    label: 'Reembolsado',
  },
};

export const PaymentTable = ({
  isRefreshing,
  onPageChange,
  onRefund,
  onStatusUpdate,
  pagination,
  payments,
}: PaymentTableProps) => {
  const { t } = useTranslation();

  // State for modals and actions
  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentView | null>(null);
  const [actionType, setActionType] = useState<'refund' | 'status' | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  // Format functions
  const formatCurrency = (amount: number, currency: string = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
      currency: currency,
      style: 'currency',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get available actions for a payment
  const getPaymentActions = (payment: AdminPaymentView): AdminPaymentAction[] => {
    const actions: AdminPaymentAction[] = [];

    // View reservation action
    actions.push({
      enabled: true,
      id: `view_${payment.id}`,
      label: t('admin.payments.actions.viewReservation'),
      type: 'view',
    });

    // Refund action (only for completed payments)
    if (payment?.status === 'completed') {
      actions.push({
        enabled: true,
        id: `refund_${payment.id}`,
        label: t('admin.payments.actions.processRefund'),
        type: 'refund',
      });
    }

    // Status update action (for failed payments that can be manually verified)
    if (payment?.status === 'failed') {
      actions.push({
        enabled: true,
        id: `status_${payment.id}`,
        label: t('admin.payments.actions.markAsCompleted'),
        type: 'status',
      });
    }

    return actions;
  };

  // Handle action click
  const handleActionClick = (payment: AdminPaymentView, actionType: string) => {
    setSelectedPayment(payment);
    setShowMenu(null);

    switch (actionType) {
      case 'refund':
        setActionType('refund');
        setShowActionModal(true);
        break;
      case 'update_status':
        setActionType('status');
        setShowActionModal(true);
        break;
      case 'view_reservation':
        // Navigate to reservation details
        window.open(`/admin/reservations/${payment.reservationId}`, '_blank');
        break;
    }
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      onPageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      onPageChange(pagination.page + 1);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowActionModal(false);
    setSelectedPayment(null);
    setActionType(null);
  };

  if (payments.length === 0) {
    return (
      <S.EmptyStateContainer>
        <S.EmptyIcon>
          <AlertTriangle />
        </S.EmptyIcon>
        <S.EmptyTitle>{t('admin.payments.table.noResults')}</S.EmptyTitle>
        <S.EmptyDescription>{t('admin.payments.table.noResultsDescription')}</S.EmptyDescription>
      </S.EmptyStateContainer>
    );
  }

  return (
    <S.TableContainer>
      {/* Table */}
      <S.TableWrapper>
        <S.Table>
          <S.TableHeader>
            <S.TableHeaderRow>
              <S.TableHeaderCell>{t('admin.payments.table.payment')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('admin.payments.table.amount')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('admin.payments.table?.status')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('admin.payments.table.customer')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('admin.payments.table.venue')}</S.TableHeaderCell>
              <S.TableHeaderCell>{t('admin.payments.table.date')}</S.TableHeaderCell>
              <S.TableHeaderCell align='right'>
                {t('admin.payments.table.actions')}
              </S.TableHeaderCell>
            </S.TableHeaderRow>
          </S.TableHeader>
          <S.TableBody>
            {payments.map((payment) => {
              const statusConfig = STATUS_CONFIG[payment?.status];
              const StatusIcon = statusConfig.icon;
              const actions = getPaymentActions(payment);

              return (
                <S.TableRow isRefreshing={isRefreshing} key={payment.id}>
                  {/* Payment Info */}
                  <S.TableCell>
                    <S.PaymentInfoContainer>
                      <S.PaymentIcon>
                        <CreditCard />
                      </S.PaymentIcon>
                      <S.PaymentDetails>
                        <S.PaymentId>{payment.id.slice(-8)}</S.PaymentId>
                        <S.ServiceName>{payment.serviceName}</S.ServiceName>
                        {payment.paymentMethod && (
                          <S.PaymentMethod>
                            {payment.paymentMethod.brand} ****{payment.paymentMethod.last4}
                          </S.PaymentMethod>
                        )}
                      </S.PaymentDetails>
                    </S.PaymentInfoContainer>
                  </S.TableCell>

                  {/* Amount */}
                  <S.TableCell>
                    <S.AmountCell>{formatCurrency(payment.amount, payment.currency)}</S.AmountCell>
                  </S.TableCell>

                  {/* Status */}
                  <S.TableCell>
                    <Badge variant={statusConfig.color}>
                      <StatusIcon className='w-3 h-3' />
                      {statusConfig.label}
                    </Badge>
                  </S.TableCell>

                  {/* Customer */}
                  <S.TableCell>
                    <S.CustomerInfo>
                      <S.CustomerName>{payment.userName}</S.CustomerName>
                      <S.CustomerEmail>{payment.userEmail}</S.CustomerEmail>
                    </S.CustomerInfo>
                  </S.TableCell>

                  {/* Venue */}
                  <S.TableCell>
                    <S.VenueName>{payment.venueName}</S.VenueName>
                  </S.TableCell>

                  {/* Date */}
                  <S.TableCell>
                    <S.DateText>{formatDate(payment.createdAt)}</S.DateText>
                  </S.TableCell>

                  {/* Actions */}
                  <S.ActionsCell>
                    <S.ActionsContainer>
                      <Button
                        disabled={isRefreshing}
                        size='small'
                        variant='text'
                        onClick={() => setShowMenu(showMenu === payment.id ? null : payment.id)}
                      >
                        <MoreVertical className='w-4 h-4' />
                      </Button>

                      {showMenu === payment.id && (
                        <S.ActionsMenu>
                          <S.ActionsMenuContent>
                            {actions.map((action, index) => (
                              <S.ActionButton
                                key={index}
                                variant='default'
                                onClick={() => handleActionClick(payment, action.type)}
                              >
                                {action.label}
                              </S.ActionButton>
                            ))}
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
          {t('admin.payments.table.showing')}{' '}
          <span>{(pagination.page - 1) * pagination.limit + 1}</span> {t('admin.payments.table.to')}{' '}
          <span>{Math.min(pagination.page * pagination.limit, pagination.total)}</span>{' '}
          {t('admin.payments.table.of')} <span>{pagination.total}</span>{' '}
          {t('admin.payments.table.results')}
        </S.PaginationInfo>

        <S.PaginationControls>
          <Button
            disabled={pagination.page <= 1 || isRefreshing}
            variant='outlined'
            onClick={handlePreviousPage}
          >
            {t('common.previous')}
          </Button>

          <S.PaginationText>
            {t('admin.payments.table.page')} {pagination.page} {t('admin.payments.table.of')}{' '}
            {pagination.totalPages}
          </S.PaginationText>

          <Button
            disabled={!pagination.hasMore || isRefreshing}
            variant='outlined'
            onClick={handleNextPage}
          >
            {t('common.next')}
          </Button>
        </S.PaginationControls>
      </S.PaginationContainer>

      {/* Action Modal */}
      {showActionModal && selectedPayment && actionType && (
        <PaymentActionModal
          actionType={actionType}
          payment={selectedPayment}
          onClose={handleCloseModal}
          onRefund={onRefund}
          onStatusUpdate={onStatusUpdate}
        />
      )}

      {/* Click outside to close menu */}
      {showMenu && <S.MenuOverlay onClick={() => setShowMenu(null)} />}
    </S.TableContainer>
  );
};
