import { Service, ServiceFilters } from '@services/core/api';

export interface ServicesManagementProps {
  // Component currently has no props - can be expanded later
}

export interface LocalFilters {
  category: Service['category'] | undefined;
  isActive: boolean | undefined;
  search: string;
}

export interface ServiceModalState {
  isServiceModalOpen: boolean;
  serviceModalMode: 'create' | 'edit';
  selectedService: Service | null;
}

export interface MockVenue {
  id: string;
  name: string;
}

export type ServiceCategory = Service['category'];

export type ButtonVariant = 'primary' | 'secondary';

export type StatusBadgeStatus = boolean;

export type ActionButtonVariant = 'edit' | 'delete' | 'toggle';
