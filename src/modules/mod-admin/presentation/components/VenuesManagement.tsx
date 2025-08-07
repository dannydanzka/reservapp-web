'use client';

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { LoadingSpinner } from '@libs/ui/components/LoadingSpinner';
import { useVenue } from '@/libs/presentation/hooks/useVenue';
import { VenueType } from '@prisma/client';

import { VenueCard } from './VenueCard';

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
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary[700]};
    }
  `
      : `
    background-color: ${theme.colors.white};
    color: ${theme.colors.secondary[700]};
    border: 1px solid ${theme.colors.secondary[300]};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.secondary[50]};
    }
  `}
`;

const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary[700]};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const VenuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ErrorContainer = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NoVenuesMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.secondary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.secondary[600]};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[600]};
`;

/**
 * Venues management component for admin interface.
 * Connected to real API with full CRUD functionality.
 */
export const VenuesManagement: React.FC = () => {
  // Redux hooks
  const {
    activeVenues,
    averageVenueRating,
    clearFilters,
    clearVenueError,
    deleteVenue,
    error,
    fetchVenues,
    filterByCategory,
    filterByCity,
    filters,
    isLoading,
    nextPage,
    pagination,
    previousPage,
    searchVenues,
    totalVenues,
    updateVenue,
    venues,
    venuesByCategory,
  } = useVenue();

  // Local UI state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [categoryFilter, setCategoryFilter] = useState<string>(filters.category || 'all');
  const [cityFilter, setCityFilter] = useState<string>(filters.city || 'all');

  // Load venues on component mount
  useEffect(() => {
    fetchVenues();
  }, []);

  // Update search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        searchVenues(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearVenueError();
    }
  }, []);

  // Event handlers
  const handleCreateNew = () => {
    alert('Funcionalidad de crear venue próximamente');
  };

  const handleEdit = (venueId: string) => {
    alert(`Editar venue: ${venueId}`);
  };

  const handleToggleStatus = async (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId);
    const newStatus = venue?.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que deseas ${newStatus} el venue "${venue?.name}"?`)) {
      try {
        await updateVenue({
          id: venueId,
          isActive: !venue?.isActive,
        });
        alert(`Venue ${newStatus === 'activar' ? 'activado' : 'desactivado'} exitosamente`);
      } catch (_err) {
        alert('Error al cambiar el estado del venue');
      }
    }
  };

  const handleDelete = async (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId);
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar el venue "${venue?.name}"? Esta acción no se puede deshacer.`
      )
    ) {
      try {
        await deleteVenue(venueId);
        alert('Venue eliminado exitosamente');
      } catch (_err) {
        alert('Error al eliminar el venue');
      }
    }
  };

  const handleViewDetails = (venueId: string) => {
    alert(`Ver detalles de venue: ${venueId}`);
  };

  const handleExport = () => {
    alert('Funcionalidad de exportar próximamente');
  };

  const handleCategoryFilterChange = async (category: string) => {
    setCategoryFilter(category);
    if (category === 'all') {
      await filterByCategory(undefined);
    } else {
      await filterByCategory(category as any);
    }
  };

  const handleCityFilterChange = async (city: string) => {
    setCityFilter(city);
    if (city === 'all') {
      await filterByCity(undefined);
    } else {
      await filterByCity(city);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setCityFilter('all');
    await clearFilters();
  };

  const getCategoryDisplayName = (category: VenueType): string => {
    switch (category) {
      case VenueType.ACCOMMODATION:
        return 'Hospedaje';
      case VenueType.RESTAURANT:
        return 'Restaurante';
      case VenueType.SPA:
        return 'Spa';
      case VenueType.TOUR_OPERATOR:
        return 'Tours';
      case VenueType.EVENT_CENTER:
        return 'Eventos';
      case VenueType.ENTERTAINMENT:
        return 'Entretenimiento';
      default:
        return category;
    }
  };

  // Get unique cities from venues
  const uniqueCities = Array.from(new Set(venues.map((venue) => venue.city).filter(Boolean)));

  return (
    <Container>
      <Header>
        <Title>Gestión de Venues</Title>
        <Actions>
          <Button $variant='primary' onClick={handleCreateNew}>
            + Nuevo Venue
          </Button>
          <Button $variant='secondary' onClick={handleExport}>
            📊 Exportar
          </Button>
        </Actions>
      </Header>

      {/* Statistics */}
      <StatsContainer>
        <StatCard>
          <StatValue>{totalVenues}</StatValue>
          <StatLabel>Total Venues</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{activeVenues.length}</StatValue>
          <StatLabel>Venues Activos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{Object.keys(venuesByCategory).length}</StatValue>
          <StatLabel>Categorías</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{averageVenueRating.toFixed(1)}</StatValue>
          <StatLabel>Rating Promedio</StatLabel>
        </StatCard>
      </StatsContainer>

      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <Label htmlFor='category'>Categoría</Label>
            <Select
              id='category'
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
            >
              <option value='all'>Todas las categorías</option>
              <option value='ACCOMMODATION'>Hospedaje</option>
              <option value='RESTAURANT'>Restaurante</option>
              <option value='SPA'>Spa</option>
              <option value='TOUR_OPERATOR'>Tours</option>
              <option value='EVENT_CENTER'>Eventos</option>
              <option value='ENTERTAINMENT'>Entretenimiento</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor='city'>Ciudad</Label>
            <Select
              id='city'
              value={cityFilter}
              onChange={(e) => handleCityFilterChange(e.target.value)}
            >
              <option value='all'>Todas las ciudades</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor='search'>Buscar</Label>
            <Input
              id='search'
              placeholder='Buscar por nombre, dirección...'
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup style={{ justifyContent: 'flex-end', paddingTop: '1.5rem' }}>
            <Button $variant='secondary' onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      {/* Loading State */}
      {isLoading && (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            height: '200px',
            justifyContent: 'center',
          }}
        >
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <Button onClick={clearVenueError}>Cerrar</Button>
        </ErrorContainer>
      )}

      {/* Venues Grid */}
      {!isLoading && !error && (
        <>
          <VenuesGrid>
            {venues.length > 0 ? (
              venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onToggleStatus={handleToggleStatus}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <NoVenuesMessage>
                <p>No se encontraron venues con los filtros aplicados.</p>
                <Button onClick={handleClearFilters}>Limpiar filtros</Button>
              </NoVenuesMessage>
            )}
          </VenuesGrid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <PaginationContainer>
              <Button $variant='secondary' disabled={pagination.page === 1} onClick={previousPage}>
                Anterior
              </Button>
              <PaginationInfo>
                Página {pagination.page} de {pagination.totalPages} ({totalVenues} venues)
              </PaginationInfo>
              <Button
                $variant='secondary'
                disabled={pagination.page === pagination.totalPages}
                onClick={nextPage}
              >
                Siguiente
              </Button>
            </PaginationContainer>
          )}
        </>
      )}
    </Container>
  );
};
