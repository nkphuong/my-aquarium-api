import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Permission } from '../../subsystems/authorization/entities/permission.entity';

const DEFAULT_PERMISSIONS = [
  { name: 'Manage Roles', slug: 'manage-roles', group: 'authorization' },
  { name: 'Manage Users', slug: 'manage-users', group: 'users' },
  { name: 'Manage Packages', slug: 'manage-packages', group: 'subscription' },
];

export class PermissionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const perm of DEFAULT_PERMISSIONS) {
      const existing = await em.findOne(Permission, { slug: perm.slug });
      if (!existing) {
        const permission = new Permission();
        permission.fill(perm as Partial<Permission>);
        em.persist(permission);
        console.log(`Permission "${perm.slug}" created.`);
      }
    }
    await em.flush();
  }
}
