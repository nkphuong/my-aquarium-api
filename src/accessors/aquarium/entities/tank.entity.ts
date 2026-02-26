import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '@core/entities/base.entity';

/**
 * Tank domain entity
 */
@Entity({ tableName: 'tanks' })
export class Tank extends BaseEntity {
  @Property()
  name!: string;

  @Property({
    name: 'volume_liters',
    columnType: 'decimal(10,2)',
    nullable: true,
  })
  volume_liters?: string;

  @Property({ name: 'user_id', type: 'bigint', nullable: true })
  user_id?: number | null;

  @Property({ nullable: true })
  width?: number;

  @Property({ nullable: true })
  length?: number;

  @Property({ nullable: true })
  height?: number;

  @Property({ name: 'tank_type', nullable: true })
  tank_type?: string;

  @Property({ nullable: true })
  style?: string;

  @Property({ nullable: true })
  substrate?: string;

  @Property({ name: 'filter_type', nullable: true })
  filter_type?: string;

  @Property({ name: 'cover_image_url', type: 'text', nullable: true })
  cover_image_url?: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ name: 'setup_date', type: 'date', nullable: true })
  setup_date?: Date;

  @Property({ name: 'is_archived', default: false })
  is_archived: boolean = false;

  // Computed properties
  get volume(): number {
    return this.volume_liters ? Number(this.volume_liters) : 0;
  }

  get dimensions(): string {
    return `${this.length}x${this.width}x${this.height}`;
  }

  assignToUser(userId: number): this {
    this.user_id = userId;
    return this;
  }

  removeFromUser(): this {
    this.user_id = null;
    return this;
  }

  archive(): this {
    this.is_archived = true;
    return this;
  }

  unarchive(): this {
    this.is_archived = false;
    return this;
  }
}
