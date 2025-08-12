'use client';

import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from '@ui/Button';
import { ReservationStatus } from '@prisma/client';
import { TextField } from '@ui/TextField';
import { useModalAlert } from '@providers/ModalAlertProvider';
import { useTranslation } from '@i18n/index';

interface ReservationFormData {
  id?: string;
  userId: string;
  serviceId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  specialRequests?: string;
  status: ReservationStatus;
  totalAmount?: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
}

interface ReservationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  reservation?: Partial<ReservationFormData>;
  mode: 'create' | 'edit';
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary[500]};
  cursor: pointer;
  padding: 0.25rem;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[700]};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary[800]};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 500;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'PENDING':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'CONFIRMED':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'CHECKED_IN':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'CHECKED_OUT':
        return `
          background: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[800]};
        `;
      case 'NO_SHOW':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'CANCELLED':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      default:
        return `
          background: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[800]};
        `;
    }
  }}
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const ReservationFormModal: React.FC<ReservationFormModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSubmit,
  reservation,
}) => {
  const { t } = useTranslation();
  const { showModalAlert } = useModalAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ReservationFormData>({
    defaultValues: {
      checkIn: reservation?.checkIn || '',
      checkOut: reservation?.checkOut || '',
      guestCount: reservation?.guestCount || 1,
      paymentStatus: reservation?.paymentStatus || 'PENDING',
      serviceId: reservation?.serviceId || '',
      specialRequests: reservation?.specialRequests || '',
      status: reservation?.status || ReservationStatus.PENDING,
      totalAmount: reservation?.totalAmount || 0,
      userId: reservation?.userId || '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (reservation) {
      reset({
        checkIn: reservation.checkIn || '',
        checkOut: reservation.checkOut || '',
        guestCount: reservation.guestCount || 1,
        paymentStatus: reservation.paymentStatus || 'PENDING',
        serviceId: reservation.serviceId || '',
        specialRequests: reservation.specialRequests || '',
        status: reservation.status || ReservationStatus.PENDING,
        totalAmount: reservation.totalAmount || 0,
        userId: reservation.userId || '',
      });
    }
  }, [reservation, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      showModalAlert({ message: 'Reserva guardada exitosamente', title: 'Éxito' });
      handleClose();
    } catch (error) {
      console.error('Error submitting reservation:', error);
      showModalAlert({ message: 'Error al guardar la reserva', title: 'Error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const getStatusDisplayName = (status: ReservationStatus): string => {
    switch (status) {
      case ReservationStatus.PENDING:
        return '⏳ Pendiente';
      case ReservationStatus.CONFIRMED:
        return '✅ Confirmada';
      case ReservationStatus.CHECKED_IN:
        return '🔄 En Progreso';
      case ReservationStatus.CHECKED_OUT:
        return '✨ Completada';
      case ReservationStatus.CANCELLED:
        return '❌ Cancelada';
      case ReservationStatus.NO_SHOW:
        return '👻 No se presentó';
      default:
        return status;
    }
  };

  const getPaymentStatusDisplayName = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return '⏳ Pago Pendiente';
      case 'PAID':
        return '💰 Pagado';
      case 'FAILED':
        return '❌ Pago Fallido';
      case 'REFUNDED':
        return '🔄 Reembolsado';
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{mode === 'create' ? 'Crear Nueva Reserva' : 'Editar Reserva'}</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <ModalBody>
            {mode === 'edit' && reservation && (
              <InfoBox>
                <p>
                  <strong>ID de Reserva:</strong> {reservation.id || 'N/A'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <StatusBadge $status={watchedValues.status}>
                    {getStatusDisplayName(watchedValues.status)}
                  </StatusBadge>
                  <StatusBadge $status={watchedValues.paymentStatus}>
                    {getPaymentStatusDisplayName(watchedValues.paymentStatus)}
                  </StatusBadge>
                </div>
              </InfoBox>
            )}

            <FormSection>
              <SectionTitle>Información de la Reserva</SectionTitle>
              <FormGrid>
                <TextField
                  error={Boolean(errors.userId?.message)}
                  label='ID del Usuario'
                  {...register('userId', {
                    required: 'El ID del usuario es obligatorio',
                  })}
                />

                <TextField
                  error={Boolean(errors.serviceId?.message)}
                  label='ID del Servicio'
                  {...register('serviceId', {
                    required: 'El ID del servicio es obligatorio',
                  })}
                />

                <TextField
                  error={Boolean(errors.guestCount?.message)}
                  label='Número de Huéspedes'
                  min='1'
                  type='number'
                  {...register('guestCount', {
                    min: { message: 'Mínimo 1 huésped', value: 1 },
                    required: 'El número de huéspedes es obligatorio',
                    valueAsNumber: true,
                  })}
                />

                <TextField
                  error={Boolean(errors.totalAmount?.message)}
                  label='Monto Total (MXN)'
                  min='0'
                  step='0.01'
                  type='number'
                  {...register('totalAmount', {
                    min: { message: 'El monto no puede ser negativo', value: 0 },
                    valueAsNumber: true,
                  })}
                />
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>Fechas y Horarios</SectionTitle>
              <FormGrid>
                <div>
                  <label>Check-in</label>
                  <input
                    style={{
                      border: `1px solid ${errors.checkIn ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '0.375rem',
                      padding: '0.75rem',
                      width: '100%',
                    }}
                    type='datetime-local'
                    {...register('checkIn', {
                      required: 'La fecha de check-in es obligatoria',
                    })}
                  />
                  {errors.checkIn && (
                    <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                      {errors.checkIn.message}
                    </span>
                  )}
                </div>

                <div>
                  <label>Check-out</label>
                  <input
                    style={{
                      border: `1px solid ${errors.checkOut ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '0.375rem',
                      padding: '0.75rem',
                      width: '100%',
                    }}
                    type='datetime-local'
                    {...register('checkOut', {
                      required: 'La fecha de check-out es obligatoria',
                    })}
                  />
                  {errors.checkOut && (
                    <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                      {errors.checkOut.message}
                    </span>
                  )}
                </div>
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>Estado</SectionTitle>
              <FormGrid>
                <div>
                  <label>Estado de la Reserva</label>
                  <Select {...register('status', { required: 'El estado es obligatorio' })}>
                    <option value={ReservationStatus.PENDING}>⏳ Pendiente</option>
                    <option value={ReservationStatus.CONFIRMED}>✅ Confirmada</option>
                    <option value={ReservationStatus.CHECKED_IN}>🔄 Check-in</option>
                    <option value={ReservationStatus.CHECKED_OUT}>✨ Check-out</option>
                    <option value={ReservationStatus.CANCELLED}>❌ Cancelada</option>
                    <option value={ReservationStatus.NO_SHOW}>👻 No Show</option>
                  </Select>
                </div>

                <div>
                  <label>Estado del Pago</label>
                  <Select
                    {...register('paymentStatus', {
                      required: 'El estado del pago es obligatorio',
                    })}
                  >
                    <option value='PENDING'>⏳ Pago Pendiente</option>
                    <option value='PAID'>💰 Pagado</option>
                    <option value='FAILED'>❌ Pago Fallido</option>
                    <option value='REFUNDED'>🔄 Reembolsado</option>
                  </Select>
                </div>
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>Solicitudes Especiales</SectionTitle>
              <TextArea
                placeholder='Solicitudes especiales del cliente...'
                {...register('specialRequests')}
              />
            </FormSection>
          </ModalBody>

          <ModalFooter>
            <Button
              color='secondary'
              disabled={isSubmitting}
              type='button'
              variant='outlined'
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              color='primary'
              disabled={isSubmitting}
              loading={isSubmitting}
              type='submit'
              variant='contained'
            >
              {mode === 'create' ? 'Crear Reserva' : 'Actualizar Reserva'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};
