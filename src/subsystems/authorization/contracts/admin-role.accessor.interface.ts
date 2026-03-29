import { AdminRoleAssignment } from '../entities/admin-role-assignment.entity';

export interface IAdminRoleAccessor {
  findByAdminId(adminId: number): Promise<AdminRoleAssignment[]>;
  assign(adminId: number, roleId: number): Promise<void>;
  remove(adminId: number, roleId: number): Promise<void>;
  removeAll(adminId: number): Promise<void>;
}

export const ADMIN_ROLE_ACCESSOR = Symbol('IAdminRoleAccessor');
