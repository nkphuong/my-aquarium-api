import { Entity, Property, OneToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { BaseEntity } from '@core/entity/base.entity';
import type { MustVerifyEmail } from '../contracts/must-verify-email.interface';
import { UserToken } from './user-token.entity';

/**
 * User domain entity
 */
@Entity({ tableName: 'users' })
export class User extends BaseEntity implements MustVerifyEmail {
  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  fullname?: string;

  @Property({ nullable: true, name: 'verified_at' })
  verifiedAt?: Date;

  @OneToMany(() => UserToken, (token) => token.tokenable)
  tokens = new Collection<UserToken>(this);

  hasVerifiedEmail(): boolean {
    return this.verifiedAt != null;
  }

  markEmailAsVerified(): void {
    this.verifiedAt = new Date();
  }
}
