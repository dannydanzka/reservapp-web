import { VenueRepository, VenueWithDetails } from '../interfaces/venue.interfaces';

export class GetVenueByIdUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(venueId: string): Promise<VenueWithDetails> {
    try {
      if (!venueId || venueId.trim() === '') {
        throw new Error('Venue ID is required');
      }

      const venue = await this.venueRepository.findById(venueId);

      if (!venue) {
        throw new Error(`Venue with ID ${venueId} not found`);
      }

      if (!venue.isActive) {
        throw new Error(`Venue with ID ${venueId} is not available`);
      }

      return venue;
    } catch (error) {
      throw new Error(
        `Failed to get venue: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
