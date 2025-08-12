import { UserRoleEnum as UserRole } from '@prisma/client';

export interface UsersManagementProps {
  // Component currently has no props - can be expanded later
}

export interface UserModalState {
  isModalOpen: boolean;
  modalMode: 'create' | 'edit';
  selectedUser: any;
}

export interface UserFilters {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

export type ButtonVariant = 'primary' | 'secondary';

export type ActionButtonVariant = 'edit' | 'warning' | 'success' | 'danger';

export type UserRoleType = UserRole;
