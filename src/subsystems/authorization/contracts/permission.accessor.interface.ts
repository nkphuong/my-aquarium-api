import { Permission } from '../entities/permission.entity';

export interface IPermissionAccessor {
  findById(id: number): Promise<Permission | null>;
  findBySlug(slug: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  findByRoleId(roleId: number): Promise<Permission[]>;
  save(permission: Permission): Promise<Permission>;
  delete(id: number): Promise<void>;
}

export const PERMISSION_ACCESSOR = Symbol('IPermissionAccessor');
