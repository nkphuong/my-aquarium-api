import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@core/entity/base.entity';

/**
 * Fish domain entity
 */
@Entity({ tableName: 'fishes' })
export class Fish extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  species!: string;

  @Property({ name: 'tank_id', type: 'bigint', nullable: true })
  tank_id?: number | null;

  // ===== Business Methods =====

  assignToTank(tankId: number): this {
    this.tank_id = tankId;
    return this;
  }

  removeFromTank(): this {
    this.tank_id = null;
    return this;
  }
}
