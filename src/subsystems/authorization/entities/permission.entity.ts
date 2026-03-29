import { Entity, Property, ManyToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { BaseEntity } from '@core/entity/base.entity';
import { Role } from './role.entity';

@Entity({ tableName: 'permissions' })
export class Permission extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @Property({ unique: true })
  slug!: string;

  @Property({ length: 50 })
  group!: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles = new Collection<Role>(this);
}
