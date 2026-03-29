import { Entity, Property, OneToMany } from '@mikro-orm/decorators/legacy';
import { Collection } from '@mikro-orm/core';
import { BaseEntity } from '@core/entity/base.entity';
import { PackageFeature } from './package-feature.entity';

@Entity({ tableName: 'packages' })
export class Package extends BaseEntity {
  @Property({ unique: true })
  name!: string;

  @Property({ unique: true })
  slug!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ name: 'is_active', default: true })
  isActive: boolean = true;

  @Property({ name: 'sort_order', default: 0 })
  sortOrder: number = 0;

  @OneToMany(() => PackageFeature, (feature) => feature.package)
  features = new Collection<PackageFeature>(this);
}
