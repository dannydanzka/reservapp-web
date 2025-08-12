import { VenueRepository } from '../interfaces/venue.interfaces';

export interface CheckAvailabilityParams {
  venueId: string;
  checkIn: string | Date;
  checkOut: string | Date;
  guests: number;
}

export class CheckVenueAvailabilityUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(params: CheckAvailabilityParams): Promise<boolean> {
    try {
      const { checkIn, checkOut, guests, venueId } = params;

      // Validate required parameters
      if (!venueId || venueId.trim() === '') {
        throw new Error('Venue ID is required');
      }

      if (!checkIn || !checkOut) {
        throw new Error('Check-in and check-out dates are required');
      }

      if (!guests || guests < 1) {
        throw new Error('Guest count must be at least 1');
      }

      // Convert to Date objects
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Validate dates
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        throw new Error('Invalid date format');
      }

      if (checkInDate >= checkOutDate) {
        throw new Error('Check-out date must be after check-in date');
      }

      if (checkInDate < new Date()) {
        throw new Error('Check-in date cannot be in the past');
      }

      // Check if venue exists and is active
      const venue = await this.venueRepository.findById(venueId);
      if (!venue) {
        throw new Error(`Venue with ID ${venueId} not found`);
      }

      if (!venue.isActive) {
        return false;
      }

      // Check capacity
      if (guests > venue.capacity) {
        return false;
      }

      // Check availability through repository
      return await this.venueRepository.checkAvailability(
        venueId,
        checkInDate,
        checkOutDate,
        guests
      );
    } catch (error) {
      throw new Error(
        `Failed to check availability: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
