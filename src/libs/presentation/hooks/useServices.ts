/**
 * Services Hook using HTTP API instead of Prisma direct
 * Replaces the old useService.stub.ts
 */

import { useCallback, useState } from 'react';

import {
  Service,
  ServiceCreateData,
  ServiceFilters,
  servicesApiService,
  ServiceUpdateData,
} from '@services/core/api';

export interface UseServicesReturn {
  // State
  services: Service[];
  isLoading: boolean;
  error: string | null;
  totalServices: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  hasServices: boolean;
  hasActiveFilters: boolean;

  // Actions
  loadServices: (filters?: ServiceFilters, page?: number, limit?: number) => Promise<void>;
  createService: (serviceData: ServiceCreateData) => Promise<Service | null>;
  updateService: (serviceData: ServiceUpdateData) => Promise<Service | null>;
  deleteService: (id: string) => Promise<boolean>;
  toggleServiceStatus: (id: string) => Promise<boolean>;
  clearError: () => void;
  clearFilters: () => void;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  setFilters: (filters: ServiceFilters) => void;

  // Computed values
  currentPageInfo: {
    current: number;
    total: number;
  };
  filters: ServiceFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useServices(): UseServicesReturn {
  // State
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ServiceFilters>({});
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    pages: 0,
    total: 0,
  });

  // Computed values
  const totalServices = pagination.total;
  const currentPage = pagination.page;
  const totalPages = pagination.pages;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const hasServices = services.length > 0;
  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      filters[key as keyof ServiceFilters] !== undefined &&
      filters[key as keyof ServiceFilters] !== null &&
      filters[key as keyof ServiceFilters] !== ''
  );

  const currentPageInfo = {
    current: currentPage,
    total: totalPages,
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  // Set filters
  const setFilters = useCallback((newFilters: ServiceFilters) => {
    setFiltersState(newFilters);
  }, []);

  // Load services
  const loadServices = useCallback(
    async (serviceFilters?: ServiceFilters, page = 1, limit = 10) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await servicesApiService.getServices({
          filters: serviceFilters || filters,
          pagination: { limit, page },
        });

        if (response.success) {
          setServices(response.data);
          setPagination(response.pagination);
        } else {
          throw new Error(response.message || 'Error al cargar servicios');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Create service
  const createService = useCallback(
    async (serviceData: ServiceCreateData): Promise<Service | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await servicesApiService.createService(serviceData);

        if (response.success) {
          // Reload services to get updated list
          await loadServices();
          return response.data;
        } else {
          throw new Error(response.message || 'Error al crear servicio');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [loadServices]
  );

  // Update service
  const updateService = useCallback(
    async (serviceData: ServiceUpdateData): Promise<Service | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await servicesApiService.updateService(serviceData);

        if (response.success) {
          // Update local state
          setServices((prev) =>
            prev.map((service) => (service.id === serviceData.id ? response.data : service))
          );
          return response.data;
        } else {
          throw new Error(response.message || 'Error al actualizar servicio');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete service
  const deleteService = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await servicesApiService.deleteService(id);

      if (response.success) {
        // Remove from local state
        setServices((prev) => prev.filter((service) => service.id !== id));
        return true;
      } else {
        throw new Error(response.message || 'Error al eliminar servicio');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle service status
  const toggleServiceStatus = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        // Find current service to toggle its status
        const currentService = services.find((s) => s.id === id);
        if (!currentService) {
          throw new Error('Servicio no encontrado');
        }

        const response = await servicesApiService.toggleServiceStatus(id, !currentService.isActive);

        if (response.success) {
          // Update local state
          setServices((prev) =>
            prev.map((service) =>
              service.id === id ? { ...service, isActive: !service.isActive } : service
            )
          );
          return true;
        } else {
          throw new Error(response.message || 'Error al cambiar estado del servicio');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [services]
  );

  // Go to next page
  const goToNextPage = useCallback(async () => {
    if (hasNextPage) {
      await loadServices(filters, currentPage + 1, pagination.limit);
    }
  }, [hasNextPage, loadServices, filters, currentPage, pagination.limit]);

  // Go to previous page
  const goToPreviousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await loadServices(filters, currentPage - 1, pagination.limit);
    }
  }, [hasPreviousPage, loadServices, filters, currentPage, pagination.limit]);

  return {
    clearError,

    clearFilters,

    createService,

    currentPage,

    // Computed values
    currentPageInfo,

    deleteService,

    error,

    filters,

    goToNextPage,

    goToPreviousPage,

    hasActiveFilters,
    hasNextPage,

    hasPreviousPage,

    hasServices,

    isLoading,

    // Actions
    loadServices,

    pagination,

    // State
    services,

    setFilters,

    toggleServiceStatus,

    totalPages,
    totalServices,
    updateService,
  };
}
