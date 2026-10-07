export type UserRole = 'admin' | 'editor' | 'viewer';

export type Permission =
  | 'projects:read'
  | 'projects:write'
  | 'projects:delete'
  | 'blogs:read'
  | 'blogs:write'
  | 'blogs:delete'
  | 'learning:read'
  | 'learning:write'
  | 'journey:read'
  | 'journey:write'
  | 'academics:read'
  | 'academics:write'
  | 'freelancing:read'
  | 'freelancing:write'
  | 'media:read'
  | 'media:write'
  | 'media:delete'
  | 'settings:read'
  | 'settings:write'
  | 'profile:read'
  | 'profile:write';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'projects:read',
    'projects:write',
    'projects:delete',
    'blogs:read',
    'blogs:write',
    'blogs:delete',
    'learning:read',
    'learning:write',
    'journey:read',
    'journey:write',
    'academics:read',
    'academics:write',
    'freelancing:read',
    'freelancing:write',
    'media:read',
    'media:write',
    'media:delete',
    'settings:read',
    'settings:write',
    'profile:read',
    'profile:write',
  ],
  editor: [
    'projects:read',
    'projects:write',
    'blogs:read',
    'blogs:write',
    'learning:read',
    'learning:write',
    'journey:read',
    'journey:write',
    'media:read',
    'media:write',
  ],
  viewer: [
    'projects:read',
    'blogs:read',
    'learning:read',
    'journey:read',
    'academics:read',
    'freelancing:read',
    'media:read',
    'settings:read',
    'profile:read',
  ],
};

export class PermissionManager {
  public static getPermissionsForRole(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  public static hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = this.getPermissionsForRole(role);
    return permissions.includes(permission);
  }

  public static hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every((p) => this.hasPermission(role, p));
  }

  public static hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(role, p));
  }
}
