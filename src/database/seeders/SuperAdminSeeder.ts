import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../subsystems/membership/entities/admin.entity';
import { AdminFactory } from '../factories/AdminFactory';

export class SuperAdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const email = process.env.SUPER_ADMIN_EMAIL ?? 'admin@aquarium.local';
    const password = process.env.SUPER_ADMIN_PASSWORD ?? 'changeme123';

    const existing = await em.findOne(Admin, { email });

    if (existing) {
      console.log(`Super admin "${email}" already exists — skipping.`);
      return;
    }

    const factory = new AdminFactory(em);
    await factory.createOne({
      email,
      password: bcrypt.hashSync(password, 10),
      fullname: 'Super Admin',
      verifiedAt: new Date(),
    });

    console.log(`Super admin "${email}" created successfully.`);
  }
}
