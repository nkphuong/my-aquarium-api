import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../subsystems/membership/entities/admin.entity';

export class AdminFactory extends Factory<Admin> {
  model = Admin;

  definition(): Partial<Admin> {
    return {
      email: faker.internet.email(),
      password: bcrypt.hashSync('password123', 10),
      fullname: faker.person.fullName(),
      verifiedAt: new Date(),
    };
  }
}
