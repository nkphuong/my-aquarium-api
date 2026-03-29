import { Entity, Property, ManyToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { BaseEntity } from '@core/entity/base.entity';
import { Permission } from './permission.entity';

@Entity({ tableName: 'roles' })
export class Role extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @Property({ unique: true })
  slug!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ name: 'is_super_admin', type: 'boolean', default: false })
  isSuperAdmin: boolean = false;

  @ManyToMany(() => Permission, undefined, { pivotTable: 'role_permissions' })
  permissions = new Collection<Permission>(this);
}
