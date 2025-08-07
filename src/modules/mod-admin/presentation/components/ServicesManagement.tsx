'use client';

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { LoadingSpinner } from '@libs/ui/components/LoadingSpinner';
import { Service, ServiceFilters } from '@/libs/core/state/slices/service.slice.stub';
import { useAuth } from '@/libs/ui/providers/AuthProvider';
import { useService } from '@/libs/presentation/hooks/useService.stub';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: ${({ theme }) => theme.transitions.normal};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  ${({ $variant = 'primary', theme }) =>
    $variant === 'primary'
      ? `
        background-color: ${theme.colors.primary[600]};
        color: white;
        
        &:hover {
          background-color: ${theme.colors.primary[700]};
        }
      `
      : `
        background-color: white;
        color: ${theme.colors.secondary[700]};
        border: 1px solid ${theme.colors.secondary[300]};
        
        &:hover {
          background-color: ${theme.colors.secondary[50]};
        }
      `}
`;

const Filters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  flex: 1;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary[700]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[500]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[500]};
  }
`;

const Table = styled.table`
  width: 100%;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  text-align: left;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  }
`;

const StatusBadge = styled.span<{ $status: boolean }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  ${({ $status, theme }) =>
    $status
      ? `
        background-color: ${theme.colors.success[100]};
        color: ${theme.colors.success[800]};
      `
      : `
        background-color: ${theme.colors.error[100]};
        color: ${theme.colors.error[800]};
      `}
`;

const CategoryBadge = styled.span<{ $category: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[800]};
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' | 'toggle' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  margin-right: ${({ theme }) => theme.spacing[2]};

  ${({ $variant = 'edit', theme }) => {
    switch ($variant) {
      case 'edit':
        return `
          background-color: ${theme.colors.info[100]};
          color: ${theme.colors.info[700]};
          &:hover {
            background-color: ${theme.colors.info[200]};
          }
        `;
      case 'delete':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
          &:hover {
            background-color: ${theme.colors.error[200]};
          }
        `;
      case 'toggle':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
          &:hover {
            background-color: ${theme.colors.warning[200]};
          }
        `;
      default:
        return '';
    }
  }}
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary[500]};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.error[50]};
  color: ${({ theme }) => theme.colors.error[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const PaginationInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[700]};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
  }
`;

// Simple Service Modal Component
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  color: ${({ theme }) => theme.colors.secondary[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[700]};
  }
`;

interface ServiceModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  service: Service | null;
  onClose: () => void;
  businessName?: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  businessName,
  isOpen,
  mode,
  onClose,
  service,
}) => {
  if (!isOpen) return null;

  const handleCreateService = () => {
    // TODO: Implement actual service creation
    alert(
      'Funcionalidad de creación de servicios próximamente. Esta es una demostración del flujo completo.'
    );
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {mode === 'create'
              ? `Nuevo Servicio${businessName ? ` - ${businessName}` : ''}`
              : `Editar Servicio${businessName ? ` - ${businessName}` : ''}`}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
            {mode === 'create'
              ? 'Aquí podrás crear servicios para tu negocio como:'
              : 'Aquí podrás editar los detalles del servicio:'}
          </p>

          {mode === 'create' && (
            <ul style={{ color: '#6B7280', marginBottom: '2rem', textAlign: 'left' }}>
              <li>🍽️ Servicios de restaurante (reservas de mesa, menús especiales)</li>
              <li>💆 Servicios de spa (masajes, tratamientos faciales)</li>
              <li>🏨 Servicios de hotel (habitaciones, amenidades)</li>
              <li>🎯 Tours y experiencias (guías turísticos, actividades)</li>
              <li>🎪 Eventos especiales (salones, catering)</li>
            </ul>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button $variant='secondary' onClick={onClose}>
              Cancelar
            </Button>
            <Button $variant='primary' onClick={handleCreateService}>
              {mode === 'create' ? 'Crear Servicio' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export const ServicesManagement: React.FC = () => {
  const {
    clearError,
    clearFilters,
    currentPageInfo,
    error,
    errorMessage,
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
  } = useService();

  const { user: currentUser } = useAuth();
  const isBusinessUser = currentUser?.role === 'admin' && currentUser?.businessName;

  const [localFilters, setLocalFilters] = useState<ServiceFilters>({
    category: undefined,
    isActive: undefined,
    search: '',
  });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceModalMode, setServiceModalMode] = useState<'create' | 'edit'>('create');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Load services on component mount
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Apply filters with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters();
    }, 500);

    return () => clearTimeout(timer);
  }, [localFilters, setFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value as Service['category'] | '';
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

  const handleToggleStatus = async (serviceId: string) => {
    try {
      await toggleServiceStatus();
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
    <Container>
      <Header>
        <div>
          <Title>
            {isBusinessUser ? `Servicios - ${currentUser?.businessName}` : 'Gestión de Servicios'}
          </Title>
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
        <Actions>
          <Button $variant='secondary' disabled={isLoading} onClick={handleRefresh}>
            Actualizar
          </Button>
          <Button $variant='primary' onClick={handleCreateService}>
            {isBusinessUser ? 'Agregar Servicio a mi Negocio' : 'Nuevo Servicio'}
          </Button>
        </Actions>
      </Header>

      {errorMessage && (
        <ErrorMessage>
          {errorMessage}
          <Button
            $variant='secondary'
            style={{ marginLeft: '12px', padding: '4px 8px' }}
            onClick={clearError}
          >
            Cerrar
          </Button>
        </ErrorMessage>
      )}

      <Filters>
        <FilterGroup>
          <Label>Buscar servicios</Label>
          <Input
            placeholder='Buscar por nombre o descripción...'
            type='text'
            value={localFilters.search || ''}
            onChange={handleSearchChange}
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Categoría</Label>
          <Select value={localFilters.category || ''} onChange={handleCategoryChange}>
            <option value=''>Todas las categorías</option>
            <option value='SPA'>Spa</option>
            <option value='RESTAURANT'>Restaurante</option>
            <option value='ACCOMMODATION'>Alojamiento</option>
            <option value='TOUR'>Tours</option>
            <option value='EVENT'>Eventos</option>
            <option value='ENTERTAINMENT'>Entretenimiento</option>
            <option value='OTHER'>Otros</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Estado</Label>
          <Select
            value={localFilters.isActive === undefined ? '' : localFilters.isActive.toString()}
            onChange={handleStatusChange}
          >
            <option value=''>Todos</option>
            <option value='true'>Activo</option>
            <option value='false'>Inactivo</option>
          </Select>
        </FilterGroup>

        {hasActiveFilters && (
          <FilterGroup style={{ justifyContent: 'flex-end' }}>
            <Button $variant='secondary' onClick={handleClearFilters}>
              Limpiar filtros
            </Button>
          </FilterGroup>
        )}
      </Filters>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <LoadingSpinner />
        </div>
      ) : hasServices ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Servicio</TableHeaderCell>
                <TableHeaderCell>Categoría</TableHeaderCell>
                <TableHeaderCell>Precio</TableHeaderCell>
                <TableHeaderCell>Capacidad</TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {(services as Service[]).map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <CategoryBadge $category={service.category}>
                      {getCategoryLabel(service.category)}
                    </CategoryBadge>
                  </TableCell>
                  <TableCell>{formatPrice(service.price, service.currency)}</TableCell>
                  <TableCell>{service.capacity} personas</TableCell>
                  <TableCell>
                    <StatusBadge $status={service.isActive}>
                      {service.isActive ? 'Activo' : 'Inactivo'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionButton $variant='edit'>Editar</ActionButton>
                    <ActionButton $variant='toggle' onClick={() => handleToggleStatus(service.id)}>
                      {service.isActive ? 'Desactivar' : 'Activar'}
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PaginationInfo>
              Mostrando {services.length} de {totalServices} servicios
            </PaginationInfo>
            <PaginationControls>
              <PaginationButton disabled={!hasPreviousPage} onClick={goToPreviousPage}>
                Anterior
              </PaginationButton>
              <span
                style={{
                  color: '#374151',
                  fontSize: '14px',
                  padding: '8px 12px',
                }}
              >
                Página {currentPageInfo.current} de {currentPageInfo.total}
              </span>
              <PaginationButton disabled={!hasNextPage} onClick={goToNextPage}>
                Siguiente
              </PaginationButton>
            </PaginationControls>
          </Pagination>
        </>
      ) : (
        <EmptyState>
          <h3>No hay servicios disponibles</h3>
          <p>Comienza creando tu primer servicio</p>
          <Button $variant='primary' onClick={handleCreateService}>
            Crear mi primer servicio
          </Button>
        </EmptyState>
      )}

      {/* Service Creation Modal */}
      {isServiceModalOpen && (
        <ServiceModal
          businessName={isBusinessUser ? currentUser?.businessName : undefined}
          isOpen={isServiceModalOpen}
          mode={serviceModalMode}
          service={selectedService}
          onClose={handleCloseServiceModal}
        />
      )}
    </Container>
  );
};
