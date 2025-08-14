'use client';

import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from '@ui/LoadingSpinner';
import { Service, ServiceFilters } from '@services/core/api';
import { useAuth } from '@providers/AuthProvider';
import { usePermissions } from '@presentation/hooks/usePermissions';
import { useServices } from '@presentation/hooks/useServices';
import { useTranslation } from '@i18n/index';

import type {
  LocalFilters,
  ServiceModalState,
  ServicesManagementProps,
} from './ServicesManagement.interfaces';
import { ServiceFormModal } from '../ServiceFormModal';

import * as S from './ServicesManagement.styled';

export const ServicesManagement: React.FC<ServicesManagementProps> = () => {
  const {
    clearError,
    clearFilters,
    createService,
    currentPageInfo,
    error,
    filters,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
    hasNextPage,
    hasPreviousPage,
    hasServices,
    isLoading,
    loadServices,
    pagination,
    services,
    setFilters,
    toggleServiceStatus,
    totalServices,
    updateService,
  } = useServices();

  const { user: currentUser } = useAuth();
  const { hasRole } = usePermissions();
  const { t } = useTranslation();
  const isBusinessUser = currentUser?.role === 'admin' && currentUser?.businessName;
  const isSuperAdmin = hasRole('SUPER_ADMIN');

  const [localFilters, setLocalFilters] = useState<LocalFilters>({
    category: undefined,
    isActive: undefined,
    search: '',
  });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceModalMode, setServiceModalMode] = useState<'create' | 'edit'>('create');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // TODO: Load real venues from API
  const [venues, setVenues] = useState<any[]>([]);

  // Load services on component mount
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Apply filters with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(localFilters);
    }, 500);

    return () => clearTimeout(timer);
  }, [localFilters, setFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setLocalFilters({
      ...localFilters,
      category: category === '' ? undefined : category,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setLocalFilters({
      ...localFilters,
      isActive: status === '' ? undefined : status === 'true',
    });
  };

  const handleClearFilters = () => {
    setLocalFilters({ category: undefined, isActive: undefined, search: '' });
    clearFilters();
  };

  const handleRefresh = () => {
    loadServices();
  };

  const handleCreateService = () => {
    setServiceModalMode('create');
    setSelectedService(null);
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setServiceModalMode('edit');
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleServiceSubmit = async (serviceData: any) => {
    try {
      if (serviceModalMode === 'create') {
        const result = await createService(serviceData);
        if (result) {
          handleCloseServiceModal();
        }
      } else if (selectedService) {
        const result = await updateService({ id: selectedService.id, ...serviceData });
        if (result) {
          handleCloseServiceModal();
        }
      }
    } catch (error) {
      console.error('Error submitting service:', error);
      throw error;
    }
  };

  const handleToggleStatus = async (serviceId: string) => {
    try {
      await toggleServiceStatus(serviceId);
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      currency: currency.toUpperCase(),
      style: 'currency',
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      ACCOMMODATION: 'Alojamiento',
      ENTERTAINMENT: 'Entretenimiento',
      EVENT: 'Eventos',
      OTHER: 'Otros',
      RESTAURANT: 'Restaurante',
      SPA: 'Spa',
      TOUR: 'Tours',
    };
    return labels[category] || category;
  };

  return (
    <S.Container>
      <S.Header>
        <div>
          <S.Title>
            {isBusinessUser ? `Servicios - ${currentUser?.businessName}` : 'Gestión de Servicios'}
          </S.Title>
          {isBusinessUser && (
            <p
              style={{
                color: '#6B7280',
                fontSize: '0.875rem',
                margin: '0.5rem 0 0 0',
              }}
            >
              Administra los servicios disponibles para tus clientes
            </p>
          )}
        </div>
        <S.Actions>
          <S.Button $variant='secondary' disabled={isLoading} onClick={handleRefresh}>
            Actualizar
          </S.Button>
          <S.Button $variant='primary' onClick={handleCreateService}>
            {isBusinessUser ? 'Agregar Servicio a mi Negocio' : 'Nuevo Servicio'}
          </S.Button>
        </S.Actions>
      </S.Header>

      {error && (
        <S.ErrorMessage>
          {error}
          <S.Button
            $variant='secondary'
            style={{ marginLeft: '12px', padding: '4px 8px' }}
            onClick={clearError}
          >
            Cerrar
          </S.Button>
        </S.ErrorMessage>
      )}

      <S.Filters>
        <S.FilterGroup>
          <S.Label>Buscar servicios</S.Label>
          <S.Input
            placeholder='Buscar por nombre o descripción...'
            type='text'
            value={localFilters.search || ''}
            onChange={handleSearchChange}
          />
        </S.FilterGroup>

        <S.FilterGroup>
          <S.Label>Categoría</S.Label>
          <S.Select value={localFilters.category || ''} onChange={handleCategoryChange}>
            <option value=''>Todas las categorías</option>
            <option value='SPA'>Spa</option>
            <option value='RESTAURANT'>Restaurante</option>
            <option value='ACCOMMODATION'>Alojamiento</option>
            <option value='TOUR'>Tours</option>
            <option value='EVENT'>Eventos</option>
            <option value='ENTERTAINMENT'>Entretenimiento</option>
            <option value='OTHER'>Otros</option>
          </S.Select>
        </S.FilterGroup>

        <S.FilterGroup>
          <S.Label>Estado</S.Label>
          <S.Select
            value={localFilters.isActive === undefined ? '' : localFilters.isActive.toString()}
            onChange={handleStatusChange}
          >
            <option value=''>Todos</option>
            <option value='true'>Activo</option>
            <option value='false'>Inactivo</option>
          </S.Select>
        </S.FilterGroup>

        {hasActiveFilters && (
          <S.FilterGroup style={{ justifyContent: 'flex-end' }}>
            <S.Button $variant='secondary' onClick={handleClearFilters}>
              Limpiar filtros
            </S.Button>
          </S.FilterGroup>
        )}
      </S.Filters>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <LoadingSpinner />
        </div>
      ) : hasServices ? (
        <>
          <S.Table>
            <S.TableHeader>
              <S.TableRow>
                <S.TableHeaderCell>{t('admin.services.table.name')}</S.TableHeaderCell>
                <S.TableHeaderCell>{t('admin.services.table.category')}</S.TableHeaderCell>
                <S.TableHeaderCell>{t('admin.services.table.venue')}</S.TableHeaderCell>
                {isSuperAdmin && (
                  <S.TableHeaderCell>{t('admin.services.table.businessOwner')}</S.TableHeaderCell>
                )}
                <S.TableHeaderCell>{t('admin.services.table.price')}</S.TableHeaderCell>
                <S.TableHeaderCell>{t('admin.services.table.capacity')}</S.TableHeaderCell>
                <S.TableHeaderCell>{t('admin.services.table.status')}</S.TableHeaderCell>
                <S.TableHeaderCell>{t('admin.services.table.actions')}</S.TableHeaderCell>
              </S.TableRow>
            </S.TableHeader>
            <tbody>
              {services.map((service) => (
                <S.TableRow key={service.id}>
                  <S.TableCell>
                    <div>
                      <strong>{service.name}</strong>
                      {service.description && (
                        <div
                          style={{
                            color: '#6b7280',
                            fontSize: '12px',
                            marginTop: '2px',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {service.description}
                        </div>
                      )}
                    </div>
                  </S.TableCell>
                  <S.TableCell>
                    <S.CategoryBadge $category={service.category}>
                      {getCategoryLabel(service.category)}
                    </S.CategoryBadge>
                  </S.TableCell>
                  <S.TableCell>
                    <div>
                      <strong>{service.venue?.name || 'Sin venue'}</strong>
                      {service.venue?.category && (
                        <div style={{ color: '#6b7280', fontSize: '12px' }}>
                          {getCategoryLabel(service.venue.category)}
                        </div>
                      )}
                    </div>
                  </S.TableCell>
                  {isSuperAdmin && (
                    <S.TableCell>
                      {service.venue?.owner ? (
                        <div>
                          <strong>
                            {service.venue.owner.firstName} {service.venue.owner.lastName}
                          </strong>
                          {service.venue.owner.businessAccount?.businessName && (
                            <div style={{ color: '#6b7280', fontSize: '12px' }}>
                              {service.venue.owner.businessAccount.businessName}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>Sin propietario</span>
                      )}
                    </S.TableCell>
                  )}
                  <S.TableCell>{formatPrice(service.price, service.currency)}</S.TableCell>
                  <S.TableCell>{service.capacity} personas</S.TableCell>
                  <S.TableCell>
                    <S.StatusBadge $status={service.isActive}>
                      {service.isActive ? 'Activo' : 'Inactivo'}
                    </S.StatusBadge>
                  </S.TableCell>
                  <S.TableCell>
                    <S.ActionButton $variant='edit' onClick={() => handleEditService(service)}>
                      Editar
                    </S.ActionButton>
                    <S.ActionButton
                      $variant='toggle'
                      onClick={() => handleToggleStatus(service.id)}
                    >
                      {service.isActive ? 'Desactivar' : 'Activar'}
                    </S.ActionButton>
                  </S.TableCell>
                </S.TableRow>
              ))}
            </tbody>
          </S.Table>

          <S.Pagination>
            <S.PaginationInfo>
              Mostrando {services.length} de {totalServices} servicios
            </S.PaginationInfo>
            <S.PaginationControls>
              <S.PaginationButton disabled={!hasPreviousPage} onClick={goToPreviousPage}>
                Anterior
              </S.PaginationButton>
              <span
                style={{
                  color: '#374151',
                  fontSize: '14px',
                  padding: '8px 12px',
                }}
              >
                Página {currentPageInfo.current} de {currentPageInfo.total}
              </span>
              <S.PaginationButton disabled={!hasNextPage} onClick={goToNextPage}>
                Siguiente
              </S.PaginationButton>
            </S.PaginationControls>
          </S.Pagination>
        </>
      ) : (
        <S.EmptyState>
          <h3>No hay servicios disponibles</h3>
          <p>Comienza creando tu primer servicio</p>
          <S.Button $variant='primary' onClick={handleCreateService}>
            Crear mi primer servicio
          </S.Button>
        </S.EmptyState>
      )}

      {/* Service Creation Modal */}
      <ServiceFormModal
        isOpen={isServiceModalOpen}
        mode={serviceModalMode}
        service={
          selectedService
            ? {
                amenities: selectedService.amenities || [],
                capacity: selectedService.capacity,
                category: selectedService.category as any,
                currency: selectedService.currency,
                description: selectedService.description || '',
                duration: selectedService.duration,
                images: selectedService.images || [],
                isActive: selectedService.isActive,
                name: selectedService.name,
                price: selectedService.price,
                venueId: selectedService.venueId || '',
              }
            : undefined
        }
        venues={venues}
        onClose={handleCloseServiceModal}
        onSubmit={handleServiceSubmit}
      />
    </S.Container>
  );
};
