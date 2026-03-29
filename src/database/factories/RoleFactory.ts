import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { Role } from '../../subsystems/authorization/entities/role.entity';

export class RoleFactory extends Factory<Role> {
  model = Role;

  definition(): Partial<Role> {
    const name = faker.person.jobTitle();
    return {
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.lorem.sentence(),
      isSuperAdmin: false,
    };
  }
}
