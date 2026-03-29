import { Injectable } from '@nestjs/common';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { Permission } from '../entities/permission.entity';
import type { IPermissionAccessor } from '../contracts/permission.accessor.interface';

@Injectable()
export class PermissionAccessor
  extends BaseDbAccessor
  implements IPermissionAccessor
{
  async findById(id: number): Promise<Permission | null> {
    return this.em.findOne(Permission, { id });
  }

  async findBySlug(slug: string): Promise<Permission | null> {
    return this.em.findOne(Permission, { slug });
  }

  async findAll(): Promise<Permission[]> {
    return this.em.find(
      Permission,
      {},
      { orderBy: { group: 'ASC', name: 'ASC' } },
    );
  }

  async findByRoleId(roleId: number): Promise<Permission[]> {
    return this.em.find(Permission, { roles: { id: roleId } });
  }

  async save(permission: Permission): Promise<Permission> {
    await this.em.persist(permission).flush();
    return permission;
  }

  async delete(id: number): Promise<void> {
    const permission = await this.em.findOne(Permission, { id });
    if (permission) {
      await this.em.remove(permission).flush();
    }
  }
}
