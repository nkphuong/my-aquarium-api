import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '@core/entities/base.entity';

/**
 * User domain entity
 */
@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  fullname?: string;

  @Property({ name: 'refresh_token_hash', nullable: true })
  refresh_token_hash?: string | null;

  // ===== Business Methods =====

  updateRefreshToken(hash: string | null): this {
    this.refresh_token_hash = hash;
    return this;
  }
}
