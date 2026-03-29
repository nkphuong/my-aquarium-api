import {
  Entity,
  Property,
  OneToMany,
  Enum,
} from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { BaseEntity } from '@core/entity/base.entity';
import { UserToken } from './user-token.entity';
import { MustVerifyEmail } from '../contracts/must-verify-email.interface';
import { UserStatus } from '../enums/user-status.enum';

/**
 * User domain entity
 */
@Entity({ tableName: 'users' })
export class User extends BaseEntity implements MustVerifyEmail {
  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ nullable: true })
  fullname?: string;

  @Property({ nullable: true, name: 'verified_at' })
  verifiedAt?: Date;

  @OneToMany(() => UserToken, (token) => token.tokenable)
  tokens = new Collection<UserToken>(this);

  @Enum(() => UserStatus)
  status: UserStatus = UserStatus.ACTIVE;

  @Property({ nullable: true, name: 'last_login_at' })
  lastLoginAt?: Date;

  hasVerifiedEmail(): boolean {
    return this.verifiedAt != null;
  }

  markEmailAsVerified(): void {
    this.verifiedAt = new Date();
  }
}
