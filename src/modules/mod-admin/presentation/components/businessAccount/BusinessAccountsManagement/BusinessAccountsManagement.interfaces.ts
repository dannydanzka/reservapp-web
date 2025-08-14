import { User } from '@prisma/client';

export interface BusinessAccount {
  id: string;
  businessName: string;
  taxId?: string;
  businessGiros: string[];
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: Date;
  owner: User & {
    displayName: string; // Computed property for firstName + lastName
  };
  venuesCount: number;
  servicesCount: number;
  reservationsCount: number;
  totalRevenue: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

export interface BusinessAccountsManagementProps {
  className?: string;
}

export interface FilterState {
  search: string;
  status: string;
  giro: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
