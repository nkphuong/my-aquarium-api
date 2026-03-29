import { Entity, Property, OneToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { BaseEntity } from '@core/entity/base.entity';
import { UserToken } from './user-token.entity';

/**
 * Admin domain entity
 */
@Entity({ tableName: 'admins' })
export class Admin extends BaseEntity {
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

  @Property({ nullable: true, name: 'last_login_at' })
  lastLoginAt?: Date;
}
