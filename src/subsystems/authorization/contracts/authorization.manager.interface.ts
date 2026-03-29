import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

export interface SeedPermissionDto {
  name: string;
  slug: string;
  group: string;
}

export interface IAuthorizationManager {
  // Permission checks
  getAdminPermissions(adminId: number): Promise<string[]>;
  hasPermission(adminId: number, permissionSlug: string): Promise<boolean>;

  // Role management
  createRole(dto: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Role>;
  updateRole(
    id: number,
    dto: { name?: string; description?: string },
  ): Promise<Role>;
  deleteRole(id: number): Promise<void>;
  listRoles(): Promise<Role[]>;
  assignPermissionsToRole(
    roleId: number,
    permissionSlugs: string[],
  ): Promise<void>;

  // Admin role assignment (many-to-many: one admin can have multiple roles)
  assignRoleToAdmin(adminId: number, roleId: number): Promise<void>;
  removeRoleFromAdmin(adminId: number, roleId: number): Promise<void>;
  removeAllRolesFromAdmin(adminId: number): Promise<void>;
  getAdminRoles(adminId: number): Promise<Role[]>;

  // Permission management
  listPermissions(): Promise<Permission[]>;
  seedPermissions(permissions: SeedPermissionDto[]): Promise<void>;
}

export const AUTHORIZATION_MANAGER = Symbol('IAuthorizationManager');
