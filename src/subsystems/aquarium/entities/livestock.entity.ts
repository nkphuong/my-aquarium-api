import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@core/entity/base.entity';

/**
 * Livestock domain entity
 */
@Entity({ tableName: 'livestock' })
export class Livestock extends BaseEntity {
  @Property({ name: 'tank_id', type: 'bigint', nullable: true })
  tank_id?: number | null;

  @Property()
  name!: string;

  @Property({ nullable: true })
  scientific_name?: string;

  @Property({ nullable: true })
  fishbase_id?: number;

  @Property()
  type!: string;

  @Property({ default: 1 })
  quantity: number = 1;

  @Property()
  status!: string;

  @Property({ nullable: true, type: 'text' })
  image_url?: string;

  @Property({ type: 'date', defaultRaw: 'now()' })
  added_date: Date = new Date();

  // ===== Business Methods =====

  updateQuantity(qty: number): this {
    this.quantity = qty;
    return this;
  }

  updateStatus(status: string): this {
    this.status = status;
    return this;
  }

  assignToTank(tankId: number): this {
    this.tank_id = tankId;
    return this;
  }

  removeFromTank(): this {
    this.tank_id = null;
    return this;
  }
}
