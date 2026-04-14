import { Entity, Property, Unique } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@core/entity/base.entity';

@Entity({ tableName: 'compatibility_overrides' })
@Unique({ properties: ['species_a_id', 'species_b_id'] })
export class CompatibilityOverride extends BaseEntity {
  @Property()
  species_a_id!: number;

  @Property()
  species_b_id!: number;

  @Property()
  verdict!: string;

  @Property({ type: 'text' })
  reason_vn!: string;

  @Property({ type: 'text' })
  reason_en!: string;

  @Property({ default: 'manual' })
  source: string = 'manual';
}
