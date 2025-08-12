'use client';

import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from '@ui/LoadingSpinner';
import { useVenues } from '@presentation/hooks/useVenues';
import { VenueFilters as ApiVenueFilters } from '@services/core/api/venuesApiService';

import { VenueCard } from '../VenueCard';
import type { VenueFilters, VenuesManagementProps } from './VenuesManagement.interfaces';
import { VenueFormModal } from '../VenueFormModal';

import * as S from './VenuesManagement.styled';

/**
 * Venues management component for admin interface.
 * Connected to real API with full CRUD functionality.
 */
export const VenuesManagement: React.FC<VenuesManagementProps> = () => {
  // Use HTTP API hook instead of Redux
  const {
    clearError,
    clearFilters,
    createVenue,
    currentPage,
    deleteVenue,
    error,
    filters,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    loadVenues,
    setFilters,
    toggleVenueStatus,
    totalPages,
    totalVenues,
    updateVenue,
    venues,
  } = useVenues();

  // Local UI state for filters
  const [localFilters, setLocalFilters] = useState<ApiVenueFilters>({
    category: filters.category || '',
    search: filters.search || '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Load venues on component mount
  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  // Apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(localFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters, setFilters]);

  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Event handlers
  const handleCreateNew = () => {
    setModalMode('create');
    setEditingVenue(null);
    setIsModalOpen(true);
  };

  const handleEdit = (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId);
    if (venue) {
      setModalMode('edit');
      setEditingVenue(venue);
      setIsModalOpen(true);
    }
  };

  const handleToggleStatus = async (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId);
    const newStatus = venue?.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que deseas ${newStatus} el venue "${venue?.name}"?`)) {
      const success = await toggleVenueStatus(venueId);
      if (success) {
        alert(`Venue ${newStatus === 'activar' ? 'activado' : 'desactivado'} exitosamente`);
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
      const success = await deleteVenue(venueId);
      if (success) {
        alert('Venue eliminado exitosamente');
      }
    }
  };

  const handleViewDetails = (venueId: string) => {
    alert(`Ver detalles de venue: ${venueId}`);
  };

  const handleExport = () => {
    alert('Funcionalidad de exportar próximamente');
  };

  const handleCategoryFilterChange = (category: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      category: category === 'all' ? '' : category,
    }));
  };

  const handleClearFilters = () => {
    setLocalFilters({ category: '', search: '' });
    clearFilters();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingVenue(null);
  };

  const handleVenueSubmit = async (venueData: any) => {
    try {
      if (modalMode === 'edit' && editingVenue) {
        const success = await updateVenue({ ...venueData, id: editingVenue.id });
        if (success) {
          alert('Venue actualizado exitosamente');
        }
      } else {
        const success = await createVenue(venueData);
        if (success) {
          alert('Venue creado exitosamente');
        }
      }
      setIsModalOpen(false);
      setEditingVenue(null);
    } catch (error) {
      console.error('Error in venue submission:', error);
    }
  };

  const getCategoryDisplayName = (category: string): string => {
    switch (category) {
      case 'ACCOMMODATION':
        return 'Hospedaje';
      case 'RESTAURANT':
        return 'Restaurante';
      case 'SPA':
        return 'Spa';
      case 'TOUR_OPERATOR':
        return 'Tours';
      case 'EVENT_CENTER':
        return 'Eventos';
      case 'ENTERTAINMENT':
        return 'Entretenimiento';
      default:
        return category;
    }
  };

  // Get unique cities from venues
  const uniqueCities = Array.from(new Set(venues.map((venue) => venue.city).filter(Boolean)));
  const activeVenues = venues.filter((v) => v.isActive);
  const venuesByCategory = venues.reduce(
    (acc, venue) => {
      acc[venue.category] = (acc[venue.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <S.Container>
      <S.Header>
        <S.Title>Gestión de Venues</S.Title>
        <S.Actions>
          <S.Button $variant='primary' onClick={handleCreateNew}>
            + Nuevo Venue
          </S.Button>
          <S.Button $variant='secondary' onClick={handleExport}>
            📊 Exportar
          </S.Button>
        </S.Actions>
      </S.Header>

      {/* Statistics */}
      <S.StatsContainer>
        <S.StatCard>
          <S.StatValue>{totalVenues}</S.StatValue>
          <S.StatLabel>Total Venues</S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatValue>{activeVenues.length}</S.StatValue>
          <S.StatLabel>Venues Activos</S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatValue>{Object.keys(venuesByCategory).length}</S.StatValue>
          <S.StatLabel>Categorías</S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatValue>5.0</S.StatValue>
          <S.StatLabel>Rating Promedio</S.StatLabel>
        </S.StatCard>
      </S.StatsContainer>

      <S.FilterSection>
        <S.FilterGrid>
          <S.FilterGroup>
            <S.Label htmlFor='category'>Categoría</S.Label>
            <S.Select
              id='category'
              value={localFilters.category || 'all'}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
            >
              <option value='all'>Todas las categorías</option>
              <option value='ACCOMMODATION'>Hospedaje</option>
              <option value='RESTAURANT'>Restaurante</option>
              <option value='SPA'>Spa</option>
              <option value='TOUR_OPERATOR'>Tours</option>
              <option value='EVENT_CENTER'>Eventos</option>
              <option value='ENTERTAINMENT'>Entretenimiento</option>
            </S.Select>
          </S.FilterGroup>

          <S.FilterGroup>
            <S.Label htmlFor='search'>Buscar</S.Label>
            <S.Input
              id='search'
              placeholder='Buscar por nombre, dirección...'
              type='text'
              value={localFilters.search || ''}
              onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </S.FilterGroup>

          <S.FilterGroup style={{ justifyContent: 'flex-end', paddingTop: '1.5rem' }}>
            <S.Button $variant='secondary' onClick={handleClearFilters}>
              Limpiar Filtros
            </S.Button>
          </S.FilterGroup>
        </S.FilterGrid>
      </S.FilterSection>

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
        <S.ErrorContainer>
          <S.ErrorMessage>{error}</S.ErrorMessage>
          <S.Button onClick={clearError}>Cerrar</S.Button>
        </S.ErrorContainer>
      )}

      {/* Venues Grid */}
      {!isLoading && !error && (
        <>
          <S.VenuesGrid>
            {venues.length > 0 ? (
              venues.map((venue) => {
                // Adapt API venue to VenueCard expected format
                const adaptedVenue = {
                  ...venue,
                  // Cast to VenueType
                  _count: {
                    reservations: 0,
                    services: venue.services?.length || 0, // Mock data - would come from API in real implementation
                  },
                  category: venue.category as any,
                  rating: 5.0, // Mock data - would come from API in real implementation
                };

                return (
                  <VenueCard
                    key={venue.id}
                    venue={adaptedVenue}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                    onViewDetails={handleViewDetails}
                  />
                );
              })
            ) : (
              <S.NoVenuesMessage>
                <p>No se encontraron venues con los filtros aplicados.</p>
                <S.Button onClick={handleClearFilters}>Limpiar filtros</S.Button>
              </S.NoVenuesMessage>
            )}
          </S.VenuesGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <S.PaginationContainer>
              <S.Button $variant='secondary' disabled={!hasPreviousPage} onClick={goToPreviousPage}>
                Anterior
              </S.Button>
              <S.PaginationInfo>
                Página {currentPage} de {totalPages} ({totalVenues} venues)
              </S.PaginationInfo>
              <S.Button $variant='secondary' disabled={!hasNextPage} onClick={goToNextPage}>
                Siguiente
              </S.Button>
            </S.PaginationContainer>
          )}
        </>
      )}

      {/* Venue Form Modal */}
      <VenueFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        venue={editingVenue}
        onClose={handleModalClose}
        onSubmit={handleVenueSubmit}
      />
    </S.Container>
  );
};
