'use client';

import { useState } from 'react';

import { AlertTriangle, CheckCircle, DollarSign, FileText, RotateCcw } from 'lucide-react';

import { Button } from '@ui/Button';
import { Modal } from '@ui/Modal';
import { useTranslation } from '@i18n/index';

import { PaymentActionModalProps } from './PaymentActionModal.interfaces';

import {
  ActionsContainer,
  AmountLimits,
  CurrencyIndicator,
  ErrorCard,
  ErrorContent,
  ErrorIcon,
  ErrorText,
  FormGroup,
  FormLabel,
  FormSection,
  NumberInput,
  NumberInputWrapper,
  PaymentDetailLabel,
  PaymentDetailRow,
  PaymentDetailsCard,
  PaymentDetailsGrid,
  PaymentDetailsTitle,
  PaymentDetailValue,
  TextArea,
  WarningCard,
  WarningContent,
  WarningDescription,
  WarningIcon,
  WarningText,
  WarningTitle,
} from './PaymentActionModal.styled';

export const PaymentActionModal: React.FC<PaymentActionModalProps> = ({
  actionType,
  onClose,
  onRefund,
  onStatusUpdate,
  payment,
}) => {
  const { t } = useTranslation();

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refund form state
  const [refundAmount, setRefundAmount] = useState<string>(payment.amount.toString());
  const [refundReason, setRefundReason] = useState<string>('');

  // Status update form state
  const [statusNotes, setStatusNotes] = useState<string>('');

  const formatCurrency = (amount: number, currency: string = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
      currency: currency,
      style: 'currency',
    }).format(amount);
  };

  const handleRefundSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const amount = parseFloat(refundAmount);

      // Validation
      if (isNaN(amount) || amount <= 0) {
        setError(t('admin.payments.actions.invalidAmount'));
        return;
      }

      if (amount > payment.amount) {
        setError(t('admin.payments.actions.refundExceedsAmount'));
        return;
      }

      if (!refundReason.trim()) {
        setError(t('admin.payments.actions.reasonRequired'));
        return;
      }

      await onRefund(payment.id, amount, refundReason);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar reembolso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!statusNotes.trim()) {
        setError(t('admin.payments.actions.notesRequired'));
        return;
      }

      await onStatusUpdate(payment.id, 'completed', statusNotes);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar estado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (actionType === 'refund') {
      handleRefundSubmit();
    } else {
      handleStatusUpdate();
    }
  };

  const modalTitle =
    actionType === 'refund'
      ? t('admin.payments.actions.processRefund')
      : t('admin.payments.actions.verifyPayment');

  const modalIcon = actionType === 'refund' ? RotateCcw : CheckCircle;

  return (
    <Modal isOpen title={modalTitle} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Payment Info */}
        <PaymentDetailsCard>
          <PaymentDetailsTitle>{t('admin.payments.actions.paymentDetails')}</PaymentDetailsTitle>
          <PaymentDetailsGrid>
            <PaymentDetailRow>
              <PaymentDetailLabel>ID:</PaymentDetailLabel>
              <PaymentDetailValue>{payment.id.slice(-12)}</PaymentDetailValue>
            </PaymentDetailRow>
            <PaymentDetailRow>
              <PaymentDetailLabel>{t('admin.payments.table.amount')}:</PaymentDetailLabel>
              <PaymentDetailValue className='currency'>
                {formatCurrency(payment.amount, payment.currency)}
              </PaymentDetailValue>
            </PaymentDetailRow>
            <PaymentDetailRow>
              <PaymentDetailLabel>{t('admin.payments.table.customer')}:</PaymentDetailLabel>
              <PaymentDetailValue>{payment.user?.fullName}</PaymentDetailValue>
            </PaymentDetailRow>
            <PaymentDetailRow>
              <PaymentDetailLabel>{t('admin.payments.table.venue')}:</PaymentDetailLabel>
              <PaymentDetailValue>{payment.venue?.name}</PaymentDetailValue>
            </PaymentDetailRow>
            <PaymentDetailRow>
              <PaymentDetailLabel>{t('admin.payments.actions.service')}:</PaymentDetailLabel>
              <PaymentDetailValue>{payment.service?.name}</PaymentDetailValue>
            </PaymentDetailRow>
          </PaymentDetailsGrid>
        </PaymentDetailsCard>

        {/* Refund Form */}
        {actionType === 'refund' && (
          <FormSection>
            <FormGroup>
              <FormLabel>
                <DollarSign size={16} />
                {t('admin.payments.actions.refundAmount')}
              </FormLabel>
              <NumberInputWrapper>
                <NumberInput
                  max={payment.amount}
                  min='0.01'
                  placeholder='0.00'
                  step='0.01'
                  type='number'
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
                <CurrencyIndicator>{payment.currency}</CurrencyIndicator>
              </NumberInputWrapper>
              <AmountLimits>
                <span>{t('admin.payments.actions.maxRefund')}:</span>
                <span>{formatCurrency(payment.amount, payment.currency)}</span>
              </AmountLimits>
            </FormGroup>

            <FormGroup>
              <FormLabel>
                <FileText size={16} />
                {t('admin.payments.actions.refundReason')}
              </FormLabel>
              <TextArea
                placeholder={t('admin.payments.actions.refundReasonPlaceholder')}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </FormGroup>

            <WarningCard $type='warning'>
              <WarningContent>
                <WarningIcon $type='warning'>
                  <AlertTriangle size={20} />
                </WarningIcon>
                <WarningText $type='warning'>
                  <WarningTitle>{t('admin.payments.actions.refundWarning')}</WarningTitle>
                  <WarningDescription>
                    {parseFloat(refundAmount) === payment.amount
                      ? t('admin.payments.actions.fullRefundWarning')
                      : t('admin.payments.actions.partialRefundWarning')}
                  </WarningDescription>
                </WarningText>
              </WarningContent>
            </WarningCard>
          </FormSection>
        )}

        {/* Status Update Form */}
        {actionType === 'status' && (
          <FormSection>
            <WarningCard $type='info'>
              <WarningContent>
                <WarningIcon $type='info'>
                  <CheckCircle size={20} />
                </WarningIcon>
                <WarningText $type='info'>
                  <WarningTitle>{t('admin.payments.actions.manualVerification')}</WarningTitle>
                  <WarningDescription>
                    {t('admin.payments.actions.manualVerificationDescription')}
                  </WarningDescription>
                </WarningText>
              </WarningContent>
            </WarningCard>

            <FormGroup>
              <FormLabel>
                <FileText size={16} />
                {t('admin.payments.actions.verificationNotes')}
              </FormLabel>
              <TextArea
                placeholder={t('admin.payments.actions.verificationNotesPlaceholder')}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </FormGroup>
          </FormSection>
        )}

        {/* Error Message */}
        {error && (
          <ErrorCard>
            <ErrorContent>
              <ErrorIcon>
                <AlertTriangle size={20} />
              </ErrorIcon>
              <ErrorText>{error}</ErrorText>
            </ErrorContent>
          </ErrorCard>
        )}

        {/* Actions */}
        <ActionsContainer>
          <Button disabled={isLoading} variant='outlined' onClick={onClose}>
            {t('common.cancel')}
          </Button>

          <Button disabled={isLoading} variant='contained' onClick={handleSubmit}>
            {actionType === 'refund'
              ? t('admin.payments.actions.confirmRefund')
              : t('admin.payments.actions.confirmVerification')}
          </Button>
        </ActionsContainer>
      </div>
    </Modal>
  );
};
