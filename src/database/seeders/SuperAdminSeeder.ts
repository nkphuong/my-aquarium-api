import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../subsystems/membership/entities/admin.entity';
import { Role } from '../../subsystems/authorization/entities/role.entity';
import { AdminRoleAssignment } from '../../subsystems/authorization/entities/admin-role-assignment.entity';
import { AdminFactory } from '../factories/AdminFactory';
import { RoleSeeder } from './RoleSeeder';

export class SuperAdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await this.call(em, [RoleSeeder]);

    const email = process.env.SUPER_ADMIN_EMAIL ?? 'admin@aquarium.local';
    const password = process.env.SUPER_ADMIN_PASSWORD ?? 'changeme123';

    let admin = await em.findOne(Admin, { email });
    if (!admin) {
      const factory = new AdminFactory(em);
      admin = await factory.createOne({
        email,
        password: bcrypt.hashSync(password, 10),
        fullname: 'Super Admin',
        verifiedAt: new Date(),
      });
      console.log(`Super admin "${email}" created.`);
    }

    const superAdminRole = await em.findOneOrFail(Role, { slug: 'super-admin' });
    if (!(await em.findOne(AdminRoleAssignment, { adminId: admin.id, role: superAdminRole }))) {
      const assignment = new AdminRoleAssignment();
      assignment.adminId = admin.id;
      assignment.role = superAdminRole;
      em.persist(assignment);
      await em.flush();
      console.log(`Super Admin role assigned to "${email}".`);
    }
  }
}
