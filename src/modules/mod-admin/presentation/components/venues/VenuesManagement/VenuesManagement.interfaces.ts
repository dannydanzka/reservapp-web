import { VenueType } from '@prisma/client';

export interface VenuesManagementProps {
  // Component currently has no props - can be expanded later
}

export interface VenueModalState {
  isModalOpen: boolean;
  editingVenue: any;
  modalMode: 'create' | 'edit';
}

export interface VenueFilters {
  searchTerm: string;
  categoryFilter: string;
  cityFilter: string;
}

export type ButtonVariant = 'primary' | 'secondary';

export type VenueCategory = VenueType;
