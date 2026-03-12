import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '@entities/base.entity';

/**
 * WaterParameter domain entity
 */
@Entity({ tableName: 'water_parameters' })
export class WaterParameter extends BaseEntity {
  @Property({ name: 'tank_id', type: 'bigint' })
  tank_id!: number;

  @Property({ name: 'tested_at', type: 'date', defaultRaw: 'now()' })
  tested_at: Date = new Date();

  @Property({ columnType: 'decimal(4,1)', nullable: true })
  temperature?: number;

  @Property({ columnType: 'decimal(3,1)', nullable: true })
  ph?: number;

  @Property({ columnType: 'decimal(5,3)', nullable: true })
  ammonia?: number;

  @Property({ columnType: 'decimal(5,3)', nullable: true })
  nitrite?: number;

  @Property({ columnType: 'decimal(6,2)', nullable: true })
  nitrate?: number;

  @Property({ columnType: 'decimal(5,1)', nullable: true })
  gh?: number;

  @Property({ columnType: 'decimal(5,1)', nullable: true })
  kh?: number;

  @Property({ type: 'text', nullable: true })
  notes?: string;
}
