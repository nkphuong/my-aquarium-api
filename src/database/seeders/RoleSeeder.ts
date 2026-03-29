import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from '../../subsystems/authorization/entities/role.entity';
import { RoleFactory } from '../factories/RoleFactory';

export class RoleSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const factory = new RoleFactory(em);

    if (!(await em.findOne(Role, { slug: 'super-admin' }))) {
      factory.makeOne({
        name: 'Super Admin',
        slug: 'super-admin',
        description: 'Full access to all system capabilities',
        isSuperAdmin: true,
      });
      await em.flush();
      console.log('Super Admin role created.');
    }
  }
}
