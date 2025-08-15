/**
 * Venue Management Hook - Presentation Layer
 * Handles venue operations and state management
 */

import { useCallback, useEffect, useState } from 'react';

import { VenueType } from '@prisma/client';

import { Venue, VenueStatus } from '../../../domain/venue/entities/Venue';

export interface VenueFilters {
  type?: VenueType;
  status?: VenueStatus;
  businessId?: string;
  city?: string;
  country?: string;
  hasServices?: boolean;
  minRating?: number;
  searchQuery?: string;
}

export interface VenueStats {
  totalVenues: number;
  activeVenues: number;
  inactiveVenues: number;
  pendingVenues: number;
  averageRating: number;
  totalReservations: number;
}

export interface UseVenueManagementReturn {
  venues: Venue[];
  loading: boolean;
  error: string | null;
  stats: VenueStats | null;
  filters: VenueFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Actions
  fetchVenues: (filters?: VenueFilters) => Promise<void>;
  fetchVenueById: (id: string) => Promise<Venue | null>;
  createVenue: (venueData: Partial<Venue>) => Promise<Venue | null>;
  updateVenue: (id: string, updates: Partial<Venue>) => Promise<boolean>;
  updateVenueStatus: (id: string, status: VenueStatus) => Promise<boolean>;
  deleteVenue: (id: string) => Promise<boolean>;
  uploadVenueImage: (id: string, file: File) => Promise<string | null>;
  removeVenueImage: (id: string, imageUrl: string) => Promise<boolean>;

  // Location & Maps
  searchNearbyVenues: (lat: number, lng: number, radius: number) => Promise<void>;
  validateVenueAddress: (address: string) => Promise<boolean>;

  // Filters & Pagination
  setFilters: (filters: VenueFilters) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearFilters: () => void;
}

export const useVenueManagement = (): UseVenueManagementReturn => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<VenueStats | null>(null);
  const [filters, setFilters] = useState<VenueFilters>({});
  const [pagination, setPagination] = useState({
    hasNext: false,
    hasPrev: false,
    limit: 20,
    page: 1,
    total: 0,
  });

  /**
   * Get auth token from localStorage (same pattern as users)
   */
  const getAuthToken = useCallback((): string => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Remove quotes if present (localStorage sometimes stores with quotes)
    return token.replace(/^"(.*)"$/, '$1');
  }, []);

  const fetchVenues = useCallback(
    async (newFilters?: VenueFilters) => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();

        const queryParams = new URLSearchParams();
        queryParams.append('page', pagination.page.toString());
        queryParams.append('limit', pagination.limit.toString());

        const activeFilters = newFilters || filters;

        if (activeFilters.type) {
          queryParams.append('type', activeFilters.type);
        }

        if (activeFilters?.status) {
          queryParams.append('status', activeFilters?.status);
        }

        if (activeFilters.businessId) {
          queryParams.append('businessId', activeFilters.businessId);
        }

        if (activeFilters.city) {
          queryParams.append('city', activeFilters.city);
        }

        if (activeFilters.country) {
          queryParams.append('country', activeFilters.country);
        }

        if (activeFilters.hasServices !== undefined) {
          queryParams.append('hasServices', activeFilters.hasServices.toString());
        }

        if (activeFilters.minRating) {
          queryParams.append('minRating', activeFilters.minRating.toString());
        }

        if (activeFilters.searchQuery) {
          queryParams.append('search', activeFilters.searchQuery);
        }

        const response = await fetch(`/api/admin/venues?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }

        const data = await response.json();

        setVenues(data.venues);
        setPagination(data.pagination);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch venues');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  const fetchVenueById = useCallback(
    async (id: string): Promise<Venue | null> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/venues/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch venue');
        }

        const data = await response.json();
        return data.venue;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch venue');
        return null;
      }
    },
    [getAuthToken]
  );

  const createVenue = useCallback(
    async (venueData: Partial<Venue>): Promise<Venue | null> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch('/api/admin/venues', {
          body: JSON.stringify(venueData),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to create venue');
        }

        const data = await response.json();
        const newVenue = data.venue;

        // Add to local state
        setVenues((prev) => [newVenue, ...prev]);

        return newVenue;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create venue');
        return null;
      }
    },
    [getAuthToken]
  );

  const updateVenue = useCallback(
    async (id: string, updates: Partial<Venue>): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/venues/${id}`, {
          body: JSON.stringify(updates),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update venue');
        }

        const data = await response.json();
        const updatedVenue = data.venue;

        // Update local state
        setVenues((prevVenues) =>
          prevVenues.map((venue) => (venue.id === id ? updatedVenue : venue))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update venue');
        return false;
      }
    },
    [getAuthToken]
  );

  const updateVenueStatus = useCallback(
    async (id: string, status: VenueStatus): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/venues/${id}/status`, {
          body: JSON.stringify({ status }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to update venue status');
        }

        // Update local state
        setVenues((prevVenues) =>
          prevVenues.map((venue) => (venue.id === id ? { ...venue, status } : venue))
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update venue status');
        return false;
      }
    },
    []
  );

  const deleteVenue = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/venues/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete venue');
        }

        // Remove from local state
        setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== id));

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete venue');
        return false;
      }
    },
    [getAuthToken]
  );

  const uploadVenueImage = useCallback(
    async (id: string, file: File): Promise<string | null> => {
      try {
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/venues/${id}/images`, {
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to upload venue image');
        }

        const data = await response.json();
        const { imageUrl } = data;

        // Update local state
        setVenues((prevVenues) =>
          prevVenues.map((venue) =>
            venue.id === id ? { ...venue, images: [...venue.images, imageUrl] } : venue
          )
        );

        return imageUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload venue image');
        return null;
      }
    },
    [getAuthToken]
  );

  const removeVenueImage = useCallback(
    async (id: string, imageUrl: string): Promise<boolean> => {
      try {
        setError(null);

        const token = getAuthToken();

        const response = await fetch(`/api/admin/venues/${id}/images`, {
          body: JSON.stringify({ imageUrl }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove venue image');
        }

        // Update local state
        setVenues((prevVenues) =>
          prevVenues.map((venue) =>
            venue.id === id
              ? { ...venue, images: venue.images.filter((img) => (img as any) !== imageUrl) }
              : venue
          )
        );

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove venue image');
        return false;
      }
    },
    [getAuthToken]
  );

  const searchNearbyVenues = useCallback(
    async (lat: number, lng: number, radius: number) => {
      try {
        setLoading(true);
        setError(null);

        const token = getAuthToken();

        const response = await fetch(
          `/api/admin/venues/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to search nearby venues');
        }

        const data = await response.json();
        setVenues(data.venues);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search nearby venues');
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken]
  );

  const validateVenueAddress = useCallback(
    async (address: string): Promise<boolean> => {
      try {
        const token = getAuthToken();

        const response = await fetch('/api/admin/venues/validate-address', {
          body: JSON.stringify({ address }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        return response.ok;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to validate address');
        return false;
      }
    },
    [getAuthToken]
  );

  const handleSetFilters = useCallback(
    (newFilters: VenueFilters) => {
      setFilters(newFilters);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    [getAuthToken]
  );

  const handleSetPage = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
    },
    [getAuthToken]
  );

  const handleSetLimit = useCallback(
    (limit: number) => {
      setPagination((prev) => ({ ...prev, limit, page: 1 }));
    },
    [getAuthToken]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [getAuthToken]);

  // Load venues on mount and when filters/pagination change
  useEffect(() => {
    fetchVenues();
  }, [filters, pagination.page, pagination.limit]);

  return {
    clearFilters,
    createVenue,
    deleteVenue,
    error,
    fetchVenueById,
    fetchVenues,
    filters,
    loading,
    pagination,
    removeVenueImage,
    searchNearbyVenues,
    setFilters: handleSetFilters,
    setLimit: handleSetLimit,
    setPage: handleSetPage,
    stats,
    updateVenue,
    updateVenueStatus,
    uploadVenueImage,
    validateVenueAddress,
    venues,
  };
};
