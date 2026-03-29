import { Injectable, Inject } from '@nestjs/common';
import type {
  IAuthorizationManager,
  SeedPermissionDto,
} from '../contracts/authorization.manager.interface';
import type { IRoleAccessor } from '../contracts/role.accessor.interface';
import { ROLE_ACCESSOR } from '../contracts/role.accessor.interface';
import type { IPermissionAccessor } from '../contracts/permission.accessor.interface';
import { PERMISSION_ACCESSOR } from '../contracts/permission.accessor.interface';
import type { IAdminRoleAccessor } from '../contracts/admin-role.accessor.interface';
import { ADMIN_ROLE_ACCESSOR } from '../contracts/admin-role.accessor.interface';
import { PermissionEngine } from '../engines/permission.engine';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RoleNotFoundException } from '../exceptions/role-not-found.exception';

@Injectable()
export class AuthorizationManager implements IAuthorizationManager {
  constructor(
    @Inject(ROLE_ACCESSOR) private readonly roleAccessor: IRoleAccessor,
    @Inject(PERMISSION_ACCESSOR)
    private readonly permissionAccessor: IPermissionAccessor,
    @Inject(ADMIN_ROLE_ACCESSOR)
    private readonly adminRoleAccessor: IAdminRoleAccessor,
    private readonly permissionEngine: PermissionEngine,
  ) {}

  async getAdminPermissions(adminId: number): Promise<string[]> {
    const assignments = await this.adminRoleAccessor.findByAdminId(adminId);
    if (assignments.length === 0) return [];

    const allPermissions: string[] = [];
    for (const assignment of assignments) {
      const permissions = await this.permissionAccessor.findByRoleId(
        assignment.role.id,
      );
      allPermissions.push(...permissions.map((p) => p.slug));
    }

    return [...new Set(allPermissions)];
  }

  async hasPermission(
    adminId: number,
    permissionSlug: string,
  ): Promise<boolean> {
    const permissions = await this.getAdminPermissions(adminId);
    return this.permissionEngine.hasPermission(permissions, permissionSlug);
  }

  async getAdminRoles(adminId: number): Promise<Role[]> {
    const assignments = await this.adminRoleAccessor.findByAdminId(adminId);
    return assignments.map((a) => a.role);
  }

  async createRole(dto: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Role> {
    const role = new Role();
    role.fill(dto as any);
    return this.roleAccessor.save(role);
  }

  async updateRole(
    id: number,
    dto: { name?: string; description?: string },
  ): Promise<Role> {
    const role = await this.roleAccessor.findById(id);
    if (!role) throw new RoleNotFoundException(id);
    role.fill(dto as any);
    return this.roleAccessor.update(id, role);
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.roleAccessor.findById(id);
    if (!role) throw new RoleNotFoundException(id);
    await this.roleAccessor.delete(id);
  }

  async listRoles(): Promise<Role[]> {
    return this.roleAccessor.findAll();
  }

  async assignPermissionsToRole(
    roleId: number,
    permissionSlugs: string[],
  ): Promise<void> {
    const role = await this.roleAccessor.findWithPermissions(roleId);
    if (!role) throw new RoleNotFoundException(roleId);

    role.permissions.removeAll();

    for (const slug of permissionSlugs) {
      const permission = await this.permissionAccessor.findBySlug(slug);
      if (permission) {
        role.permissions.add(permission);
      }
    }

    await this.roleAccessor.update(roleId, role);
  }

  async assignRoleToAdmin(adminId: number, roleId: number): Promise<void> {
    const role = await this.roleAccessor.findById(roleId);
    if (!role) throw new RoleNotFoundException(roleId);
    await this.adminRoleAccessor.assign(adminId, roleId);
  }

  async removeRoleFromAdmin(adminId: number, roleId: number): Promise<void> {
    await this.adminRoleAccessor.remove(adminId, roleId);
  }

  async removeAllRolesFromAdmin(adminId: number): Promise<void> {
    await this.adminRoleAccessor.removeAll(adminId);
  }

  async listPermissions(): Promise<Permission[]> {
    return this.permissionAccessor.findAll();
  }

  async seedPermissions(permissions: SeedPermissionDto[]): Promise<void> {
    for (const dto of permissions) {
      const existing = await this.permissionAccessor.findBySlug(dto.slug);
      if (!existing) {
        const permission = new Permission();
        permission.fill(dto as any);
        await this.permissionAccessor.save(permission);
      }
    }
  }
}
