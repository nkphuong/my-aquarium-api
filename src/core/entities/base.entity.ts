import { PrimaryKey, Property } from '@mikro-orm/core';

/**
 * Domain Base Entity mapped via MikroORM
 */
export abstract class BaseEntity {
  @PrimaryKey({ type: 'bigint', autoincrement: true })
  id!: number;

  @Property({ name: 'created_at' })
  createdAt: Date = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Merge data into this entity
   */
  fill(data: Partial<this>): this {
    Object.assign(this, data);
    return this;
  }

  /**
   * Check if entity exists in database
   */
  get exists(): boolean {
    return this.id !== undefined && this.id !== null;
  }

  /**
   * Convert to JSON for API response
   */
  toJSON(): Record<string, any> {
    return { ...this };
  }
}
