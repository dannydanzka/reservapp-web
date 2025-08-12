'use client';

import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from '@ui/Button';
import { TextField } from '@ui/TextField';
import { useModalAlert } from '@providers/ModalAlertProvider';
import { useTranslation } from '@i18n/index';

interface ServiceFormData {
  venueId: string;
  name: string;
  description: string;
  category:
    | 'ACCOMMODATION'
    | 'DINING'
    | 'SPA_WELLNESS'
    | 'TOUR_EXPERIENCE'
    | 'EVENT_MEETING'
    | 'TRANSPORTATION'
    | 'ENTERTAINMENT';
  price: number;
  currency: string;
  capacity: number;
  duration?: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
}

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  service?: Partial<ServiceFormData>;
  mode: 'create' | 'edit';
  venues?: Array<{ id: string; name: string }>;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary[700]};
  cursor: pointer;
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

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-height: 48px;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[800]};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TagRemove = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

const TagInputField = styled.input`
  border: none;
  outline: none;
  flex: 1;
  min-width: 100px;
  padding: 0.25rem;
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSubmit,
  service,
  venues = [],
}) => {
  const { t } = useTranslation();
  const { showModalAlert } = useModalAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenities, setAmenities] = useState<string[]>(service?.amenities || []);
  const [images, setImages] = useState<string[]>(service?.images || []);
  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<ServiceFormData>({
    defaultValues: {
      capacity: service?.capacity || 1,
      category: service?.category || 'ACCOMMODATION',
      currency: service?.currency || 'MXN',
      description: service?.description || '',
      duration: service?.duration || undefined,
      isActive: service?.isActive ?? true,
      name: service?.name || '',
      price: service?.price || 0,
      venueId: service?.venueId || '',
    },
  });

  const watchedCategory = watch('category');

  useEffect(() => {
    if (service) {
      reset({
        capacity: service.capacity || 1,
        category: service.category || 'ACCOMMODATION',
        currency: service.currency || 'MXN',
        description: service.description || '',
        duration: service.duration || undefined,
        isActive: service.isActive ?? true,
        name: service.name || '',
        price: service.price || 0,
        venueId: service.venueId || '',
      });
      setAmenities(service.amenities || []);
      setImages(service.images || []);
    }
  }, [service, reset]);

  const handleClose = () => {
    reset();
    setAmenities([]);
    setImages([]);
    setNewAmenity('');
    setNewImageUrl('');
    onClose();
  };

  const onFormSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        amenities,
        images,
      });
      showModalAlert({
        message: 'Servicio guardado exitosamente',
        title: 'Éxito',
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting service:', error);
      showModalAlert({
        message: 'Error al guardar el servicio',
        title: 'Error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity));
  };

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (imageUrl: string) => {
    setImages(images.filter((img) => img !== imageUrl));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const getCategoryDisplayName = (category: string): string => {
    switch (category) {
      case 'ACCOMMODATION':
        return '🏨 Hospedaje';
      case 'DINING':
        return '🍽️ Gastronomía';
      case 'SPA_WELLNESS':
        return '💆 Spa y Bienestar';
      case 'TOUR_EXPERIENCE':
        return '🎯 Tours y Experiencias';
      case 'EVENT_MEETING':
        return '🎉 Eventos y Reuniones';
      case 'TRANSPORTATION':
        return '🚗 Transporte';
      case 'ENTERTAINMENT':
        return '🎭 Entretenimiento';
      default:
        return category;
    }
  };

  const isDurationRequired = ['SPA_WELLNESS', 'TOUR_EXPERIENCE', 'ENTERTAINMENT'].includes(
    watchedCategory
  );

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{mode === 'create' ? 'Crear Nuevo Servicio' : 'Editar Servicio'}</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <ModalBody>
            <FormSection>
              <SectionTitle>Información Básica</SectionTitle>
              <FormGrid>
                <div>
                  <label>Venue</label>
                  <Select {...register('venueId', { required: 'Selecciona un venue' })}>
                    <option value=''>Seleccionar venue...</option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </Select>
                  {errors.venueId && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
                      {errors.venueId.message}
                    </span>
                  )}
                </div>

                <TextField
                  error={Boolean(errors.name)}
                  errorText={errors.name?.message}
                  label='Nombre del Servicio'
                  {...register('name', {
                    minLength: { message: 'Mínimo 2 caracteres', value: 2 },
                    required: 'El nombre es obligatorio',
                  })}
                />
              </FormGrid>

              <FormGrid>
                <div>
                  <label>Categoría</label>
                  <Select {...register('category', { required: 'La categoría es obligatoria' })}>
                    <option value='ACCOMMODATION'>🏨 Hospedaje</option>
                    <option value='DINING'>🍽️ Gastronomía</option>
                    <option value='SPA_WELLNESS'>💆 Spa y Bienestar</option>
                    <option value='TOUR_EXPERIENCE'>🎯 Tours y Experiencias</option>
                    <option value='EVENT_MEETING'>🎉 Eventos y Reuniones</option>
                    <option value='TRANSPORTATION'>🚗 Transporte</option>
                    <option value='ENTERTAINMENT'>🎭 Entretenimiento</option>
                  </Select>
                </div>

                <TextField
                  error={Boolean(errors.capacity)}
                  errorText={errors.capacity?.message}
                  label='Capacidad (personas)'
                  min='1'
                  type='number'
                  {...register('capacity', {
                    min: { message: 'Mínimo 1 persona', value: 1 },
                    required: 'La capacidad es obligatoria',
                    valueAsNumber: true,
                  })}
                />
              </FormGrid>

              <div style={{ marginTop: '1rem' }}>
                <label>Descripción</label>
                <TextArea
                  placeholder='Describe el servicio...'
                  {...register('description', {
                    minLength: { message: 'Mínimo 10 caracteres', value: 10 },
                    required: 'La descripción es obligatoria',
                  })}
                />
                {errors.description && (
                  <span style={{ color: 'red', fontSize: '0.875rem' }}>
                    {errors.description.message}
                  </span>
                )}
              </div>
            </FormSection>

            <FormSection>
              <SectionTitle>Precios y Tiempo</SectionTitle>
              <FormGrid>
                <TextField
                  error={Boolean(errors.price)}
                  errorText={errors.price?.message}
                  label='Precio'
                  min='0'
                  step='0.01'
                  type='number'
                  {...register('price', {
                    min: { message: 'El precio no puede ser negativo', value: 0 },
                    required: 'El precio es obligatorio',
                    valueAsNumber: true,
                  })}
                />

                <div>
                  <label>Moneda</label>
                  <Select {...register('currency', { required: 'La moneda es obligatoria' })}>
                    <option value='MXN'>MXN - Pesos Mexicanos</option>
                    <option value='USD'>USD - Dólares</option>
                    <option value='EUR'>EUR - Euros</option>
                  </Select>
                </div>

                {isDurationRequired && (
                  <TextField
                    error={Boolean(errors.duration)}
                    errorText={errors.duration?.message}
                    label='Duración (minutos)'
                    min='1'
                    type='number'
                    {...register('duration', {
                      min: { message: 'Mínimo 1 minuto', value: 1 },
                      required: isDurationRequired
                        ? 'La duración es obligatoria para este tipo de servicio'
                        : false,
                      valueAsNumber: true,
                    })}
                  />
                )}
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>Comodidades</SectionTitle>
              <div style={{ marginBottom: '1rem' }}>
                <TagInput>
                  {amenities.map((amenity) => (
                    <Tag key={amenity}>
                      {amenity}
                      <TagRemove onClick={() => removeAmenity(amenity)}>×</TagRemove>
                    </Tag>
                  ))}
                  <TagInputField
                    placeholder='Agregar comodidad...'
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addAmenity)}
                  />
                </TagInput>
                <Button
                  color='secondary'
                  style={{ marginTop: '0.5rem' }}
                  type='button'
                  variant='outlined'
                  onClick={addAmenity}
                >
                  + Agregar Comodidad
                </Button>
              </div>
            </FormSection>

            <FormSection>
              <SectionTitle>Imágenes</SectionTitle>
              <div style={{ marginBottom: '1rem' }}>
                <TagInput>
                  {images.map((imageUrl) => (
                    <Tag key={imageUrl}>
                      🖼️ {imageUrl.length > 30 ? imageUrl.substring(0, 30) + '...' : imageUrl}
                      <TagRemove onClick={() => removeImage(imageUrl)}>×</TagRemove>
                    </Tag>
                  ))}
                  <TagInputField
                    placeholder='URL de imagen...'
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addImage)}
                  />
                </TagInput>
                <Button
                  color='secondary'
                  style={{ marginTop: '0.5rem' }}
                  type='button'
                  variant='outlined'
                  onClick={addImage}
                >
                  + Agregar Imagen
                </Button>
              </div>
            </FormSection>

            <FormSection>
              <CheckboxGroup>
                <input id='isActive' type='checkbox' {...register('isActive')} />
                <CheckboxLabel htmlFor='isActive'>
                  Servicio activo (disponible para reservas)
                </CheckboxLabel>
              </CheckboxGroup>
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
              {mode === 'create' ? 'Crear Servicio' : 'Actualizar Servicio'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};
