// Permissions Types - Extended from admin.types.ts
import type { Permission } from './admin.types';

// Re-export Permission without duplicating it

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissionIds: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  isActive?: boolean;
  permissionIds?: string[];
}

export interface RoleFilters {
  isActive?: boolean;
  isSystemRole?: boolean;
  search?: string;
}

// System role definitions
export const SYSTEM_ROLES = {
  ADMIN: {
    description: 'Administrative access to most features',
    isSystemRole: true,
    name: 'admin',
  },
  EMPLOYEE: {
    description: 'Basic operational access',
    isSystemRole: true,
    name: 'employee',
  },
  MANAGER: {
    description: 'Venue and team management access',
    isSystemRole: true,
    name: 'manager',
  },
  SUPER_ADMIN: {
    description: 'Full system access with all permissions',
    isSystemRole: true,
    name: 'super_admin',
  },
  VIEWER: {
    description: 'Read-only access to assigned resources',
    isSystemRole: true,
    name: 'viewer',
  },
} as const;

// System permissions definitions
export const SYSTEM_PERMISSIONS = [
  // Dashboard permissions
  {
    action: 'read',
    description: 'View dashboard',
    isSystemPerm: true,
    module: 'dashboard',
    name: 'dashboard.read',
  },

  // User permissions
  {
    action: 'read',
    description: 'View users',
    isSystemPerm: true,
    module: 'users',
    name: 'users.read',
  },
  {
    action: 'create',
    description: 'Create users',
    isSystemPerm: true,
    module: 'users',
    name: 'users.create',
  },
  {
    action: 'update',
    description: 'Update users',
    isSystemPerm: true,
    module: 'users',
    name: 'users.update',
  },
  {
    action: 'delete',
    description: 'Delete users',
    isSystemPerm: true,
    module: 'users',
    name: 'users.delete',
  },
  {
    action: 'manage_permissions',
    description: 'Manage user permissions',
    isSystemPerm: true,
    module: 'users',
    name: 'users.manage_permissions',
  },

  // Venue permissions
  {
    action: 'read',
    description: 'View venues',
    isSystemPerm: true,
    module: 'venues',
    name: 'venues.read',
  },
  {
    action: 'create',
    description: 'Create venues',
    isSystemPerm: true,
    module: 'venues',
    name: 'venues.create',
  },
  {
    action: 'update',
    description: 'Update venues',
    isSystemPerm: true,
    module: 'venues',
    name: 'venues.update',
  },
  {
    action: 'delete',
    description: 'Delete venues',
    isSystemPerm: true,
    module: 'venues',
    name: 'venues.delete',
  },

  // Service permissions
  {
    action: 'read',
    description: 'View services',
    isSystemPerm: true,
    module: 'services',
    name: 'services.read',
  },
  {
    action: 'create',
    description: 'Create services',
    isSystemPerm: true,
    module: 'services',
    name: 'services.create',
  },
  {
    action: 'update',
    description: 'Update services',
    isSystemPerm: true,
    module: 'services',
    name: 'services.update',
  },
  {
    action: 'delete',
    description: 'Delete services',
    isSystemPerm: true,
    module: 'services',
    name: 'services.delete',
  },

  // Reservation permissions
  {
    action: 'read',
    description: 'View reservations',
    isSystemPerm: true,
    module: 'reservations',
    name: 'reservations.read',
  },
  {
    action: 'create',
    description: 'Create reservations',
    isSystemPerm: true,
    module: 'reservations',
    name: 'reservations.create',
  },
  {
    action: 'update',
    description: 'Update reservations',
    isSystemPerm: true,
    module: 'reservations',
    name: 'reservations.update',
  },
  {
    action: 'cancel',
    description: 'Cancel reservations',
    isSystemPerm: true,
    module: 'reservations',
    name: 'reservations.cancel',
  },

  // Payment permissions
  {
    action: 'read',
    description: 'View payments',
    isSystemPerm: true,
    module: 'payments',
    name: 'payments.read',
  },
  {
    action: 'update',
    description: 'Update payment status',
    isSystemPerm: true,
    module: 'payments',
    name: 'payments.update',
  },
  {
    action: 'refund',
    description: 'Process refunds',
    isSystemPerm: true,
    module: 'payments',
    name: 'payments.refund',
  },
  {
    action: 'verify',
    description: 'Verify payments manually',
    isSystemPerm: true,
    module: 'payments',
    name: 'payments.verify',
  },
  {
    action: 'bulk_update',
    description: 'Bulk update payments',
    isSystemPerm: true,
    module: 'payments',
    name: 'payments.bulk_update',
  },

  // Report permissions
  {
    action: 'read',
    description: 'View reports',
    isSystemPerm: true,
    module: 'reports',
    name: 'reports.read',
  },
  {
    action: 'create',
    description: 'Generate reports',
    isSystemPerm: true,
    module: 'reports',
    name: 'reports.create',
  },
  {
    action: 'export',
    description: 'Export reports',
    isSystemPerm: true,
    module: 'reports',
    name: 'reports.export',
  },

  // Receipt permissions
  {
    action: 'read',
    description: 'View receipts',
    isSystemPerm: true,
    module: 'receipts',
    name: 'receipts.read',
  },
  {
    action: 'verify',
    description: 'Verify receipts',
    isSystemPerm: true,
    module: 'receipts',
    name: 'receipts.verify',
  },

  // Audit permissions
  {
    action: 'read',
    description: 'View audit logs',
    isSystemPerm: true,
    module: 'audit',
    name: 'audit.read',
  },
] as const;

// Role-permission mappings
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'dashboard.read',
    'users.read',
    'users.create',
    'users.update',
    'venues.read',
    'venues.create',
    'venues.update',
    'services.read',
    'services.create',
    'services.update',
    'reservations.read',
    'reservations.create',
    'reservations.update',
    'reservations.cancel',
    'payments.read',
    'payments.update',
    'payments.refund',
    'payments.verify',
    'reports.read',
    'reports.create',
    'reports.export',
    'receipts.read',
    'receipts.verify',
    'audit.read',
  ],
  employee: [
    'dashboard.read',
    'venues.read',
    'services.read',
    'reservations.read',
    'reservations.create',
    'reservations.update',
    'payments.read',
    'receipts.read',
  ],
  manager: [
    'dashboard.read',
    'users.read',
    'venues.read',
    'venues.update',
    'services.read',
    'services.create',
    'services.update',
    'reservations.read',
    'reservations.create',
    'reservations.update',
    'payments.read',
    'payments.update',
    'reports.read',
    'reports.create',
    'receipts.read',
  ],
  super_admin: [
    // All permissions
    'dashboard.read',
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'users.manage_permissions',
    'venues.read',
    'venues.create',
    'venues.update',
    'venues.delete',
    'services.read',
    'services.create',
    'services.update',
    'services.delete',
    'reservations.read',
    'reservations.create',
    'reservations.update',
    'reservations.cancel',
    'payments.read',
    'payments.update',
    'payments.refund',
    'payments.verify',
    'payments.bulk_update',
    'reports.read',
    'reports.create',
    'reports.export',
    'receipts.read',
    'receipts.verify',
    'audit.read',
  ],
  viewer: [
    'dashboard.read',
    'venues.read',
    'services.read',
    'reservations.read',
    'payments.read',
    'receipts.read',
  ],
};

// UserWithRoles is exported from admin.types.ts to avoid duplication
