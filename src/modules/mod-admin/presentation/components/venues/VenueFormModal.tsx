'use client';

import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from '@ui/Button';
import { TextField } from '@ui/TextField';
import { useModalAlert } from '@providers/ModalAlertProvider';
import { useTranslation } from '@i18n/index';
import { VenueType } from '@prisma/client';

interface VenueFormData {
  name: string;
  description: string;
  category: VenueType;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
}

interface VenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VenueFormData) => Promise<void>;
  venue?: Partial<VenueFormData>;
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
  max-width: 800px;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  min-height: 100px;
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

export const VenueFormModal: React.FC<VenueFormModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSubmit,
  venue,
}) => {
  const { t } = useTranslation();
  const { showModalAlert } = useModalAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenities, setAmenities] = useState<string[]>(venue?.amenities || []);
  const [images, setImages] = useState<string[]>(venue?.images || []);
  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<VenueFormData>({
    defaultValues: {
      address: venue?.address || '',
      category: venue?.category || VenueType.ACCOMMODATION,
      city: venue?.city || '',
      description: venue?.description || '',
      email: venue?.email || '',
      isActive: venue?.isActive ?? true,
      latitude: venue?.latitude || undefined,
      longitude: venue?.longitude || undefined,
      name: venue?.name || '',
      phone: venue?.phone || '',
      website: venue?.website || '',
    },
  });

  useEffect(() => {
    if (venue) {
      reset({
        address: venue.address || '',
        category: venue.category || VenueType.ACCOMMODATION,
        city: venue.city || '',
        description: venue.description || '',
        email: venue.email || '',
        isActive: venue.isActive ?? true,
        latitude: venue.latitude || undefined,
        longitude: venue.longitude || undefined,
        name: venue.name || '',
        phone: venue.phone || '',
        website: venue.website || '',
      });
      setAmenities(venue.amenities || []);
      setImages(venue.images || []);
    }
  }, [venue, reset]);

  const handleClose = () => {
    reset();
    setAmenities([]);
    setImages([]);
    setNewAmenity('');
    setNewImageUrl('');
    onClose();
  };

  const onFormSubmit = async (data: VenueFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        amenities,
        images,
      });
      showModalAlert({
        message: 'Venue guardado exitosamente',
        title: 'Éxito',
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting venue:', error);
      showModalAlert({
        message: 'Error al guardar el venue',
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

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{mode === 'create' ? 'Crear Nuevo Venue' : 'Editar Venue'}</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <ModalBody>
            <FormSection>
              <SectionTitle>Información Básica</SectionTitle>
              <FormGrid>
                <TextField
                  error={Boolean(errors.name)}
                  errorText={errors.name?.message}
                  label='Nombre del Venue'
                  {...register('name', {
                    minLength: { message: 'Mínimo 2 caracteres', value: 2 },
                    required: 'El nombre es obligatorio',
                  })}
                />

                <div>
                  <label>Categoría</label>
                  <Select {...register('category', { required: 'La categoría es obligatoria' })}>
                    <option value={VenueType.ACCOMMODATION}>🏨 Hospedaje</option>
                    <option value={VenueType.RESTAURANT}>🍽️ Restaurante</option>
                    <option value={VenueType.SPA}>💆 Spa</option>
                    <option value={VenueType.TOUR_OPERATOR}>🎯 Tours</option>
                    <option value={VenueType.EVENT_CENTER}>🎉 Eventos</option>
                    <option value={VenueType.ENTERTAINMENT}>🎭 Entretenimiento</option>
                  </Select>
                </div>
              </FormGrid>

              <div style={{ marginTop: '1rem' }}>
                <label>Descripción</label>
                <TextArea
                  placeholder='Describe tu venue...'
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
              <SectionTitle>Ubicación y Contacto</SectionTitle>
              <FormGrid>
                <TextField
                  error={Boolean(errors.address)}
                  errorText={errors.address?.message}
                  label='Dirección'
                  {...register('address', { required: 'La dirección es obligatoria' })}
                />

                <TextField
                  error={Boolean(errors.city)}
                  errorText={errors.city?.message}
                  label='Ciudad'
                  {...register('city', { required: 'La ciudad es obligatoria' })}
                />

                <TextField
                  error={Boolean(errors.phone)}
                  errorText={errors.phone?.message}
                  label='Teléfono'
                  {...register('phone', { required: 'El teléfono es obligatorio' })}
                />

                <TextField
                  error={Boolean(errors.email)}
                  errorText={errors.email?.message}
                  label='Email'
                  type='email'
                  {...register('email', {
                    pattern: { message: 'Email inválido', value: /^\S+@\S+$/i },
                    required: 'El email es obligatorio',
                  })}
                />

                <TextField
                  error={Boolean(errors.website)}
                  errorText={errors.website?.message}
                  label='Sitio Web (Opcional)'
                  {...register('website')}
                />
              </FormGrid>

              <FormGrid style={{ marginTop: '1rem' }}>
                <TextField
                  error={Boolean(errors.latitude)}
                  errorText={errors.latitude?.message}
                  label='Latitud (Opcional)'
                  step='any'
                  type='number'
                  {...register('latitude', {
                    max: { message: 'Latitud debe estar entre -90 y 90', value: 90 },
                    min: { message: 'Latitud debe estar entre -90 y 90', value: -90 },
                    valueAsNumber: true,
                  })}
                />

                <TextField
                  error={Boolean(errors.longitude)}
                  errorText={errors.longitude?.message}
                  label='Longitud (Opcional)'
                  step='any'
                  type='number'
                  {...register('longitude', {
                    max: { message: 'Longitud debe estar entre -180 y 180', value: 180 },
                    min: { message: 'Longitud debe estar entre -180 y 180', value: -180 },
                    valueAsNumber: true,
                  })}
                />
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
                  Venue activo (visible para clientes)
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
              {mode === 'create' ? 'Crear Venue' : 'Actualizar Venue'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};
