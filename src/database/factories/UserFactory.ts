import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { User } from '../../subsystems/membership/entities/user.entity';

export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {
      email: faker.internet.email(),
      password: bcrypt.hashSync('password123', 10),
      fullname: faker.person.fullName(),
      verifiedAt: new Date(),
    };
  }
}
