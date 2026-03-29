import { Injectable } from '@nestjs/common';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { Role } from '../entities/role.entity';
import type { IRoleAccessor } from '../contracts/role.accessor.interface';

@Injectable()
export class RoleAccessor extends BaseDbAccessor implements IRoleAccessor {
  async findById(id: number): Promise<Role | null> {
    return this.em.findOne(Role, { id });
  }

  async findBySlug(slug: string): Promise<Role | null> {
    return this.em.findOne(Role, { slug });
  }

  async findAll(): Promise<Role[]> {
    return this.em.find(Role, {}, { orderBy: { name: 'ASC' } });
  }

  async findWithPermissions(id: number): Promise<Role | null> {
    return this.em.findOne(Role, { id }, { populate: ['permissions'] });
  }

  async save(role: Role): Promise<Role> {
    await this.em.persist(role).flush();
    return role;
  }

  async update(id: number, role: Role): Promise<Role> {
    this.em.assign(role, { id });
    await this.em.flush();
    return role;
  }

  async delete(id: number): Promise<void> {
    const role = await this.em.findOne(Role, { id });
    if (role) {
      await this.em.remove(role).flush();
    }
  }
}
