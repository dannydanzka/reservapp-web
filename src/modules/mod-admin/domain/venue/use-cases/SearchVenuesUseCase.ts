import {
  VenueListResponse,
  VenuePaginationOptions,
  VenueRepository,
  VenueSearchFilters,
} from '../interfaces/venue.interfaces';

export class SearchVenuesUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(
    filters?: VenueSearchFilters,
    pagination?: VenuePaginationOptions
  ): Promise<VenueListResponse> {
    try {
      // Set default pagination
      const defaultPagination: VenuePaginationOptions = {
        limit: 12,
        page: 1,
        sortBy: 'rating',
        sortOrder: 'desc',
        ...pagination,
      };

      // Validate pagination parameters
      if (defaultPagination.page < 1) {
        throw new Error('Page must be greater than 0');
      }

      if (defaultPagination.limit > 100) {
        throw new Error('Limit cannot exceed 100');
      }

      // Validate date filters
      if (filters?.checkIn && filters?.checkOut) {
        const checkInDate = new Date(filters.checkIn);
        const checkOutDate = new Date(filters.checkOut);

        if (checkInDate >= checkOutDate) {
          throw new Error('Check-out date must be after check-in date');
        }

        if (checkInDate < new Date()) {
          throw new Error('Check-in date cannot be in the past');
        }
      }

      // Validate guest count
      if (filters?.guests && filters.guests < 1) {
        throw new Error('Guest count must be at least 1');
      }

      // Validate price range
      if (filters?.minPrice && filters?.maxPrice && filters.minPrice > filters.maxPrice) {
        throw new Error('Minimum price cannot be greater than maximum price');
      }

      return await this.venueRepository.findMany(filters, defaultPagination);
    } catch (error) {
      throw new Error(
        `Failed to search venues: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
