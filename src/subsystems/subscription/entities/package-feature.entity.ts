import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@core/entity/base.entity';
import { Package } from './package.entity';

@Entity({ tableName: 'package_features' })
export class PackageFeature extends BaseEntity {
  @ManyToOne(() => Package, { name: 'package_id' })
  package!: Package;

  @Property({ name: 'feature_key' })
  featureKey!: string;

  @Property({ type: 'text' })
  value!: string;
}
