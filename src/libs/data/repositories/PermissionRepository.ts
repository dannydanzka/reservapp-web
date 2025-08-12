// Stub repository for permissions - temporary implementation

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export class PermissionRepository {
  static async findById(permissionId: string): Promise<Permission | null> {
    // Stub implementation
    return null;
  }

  static async findByResource(resource: string): Promise<Permission[]> {
    // Stub implementation
    return [];
  }

  static async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    // Stub implementation - always return false for now
    return false;
  }
}

export const permissionRepository = PermissionRepository;
