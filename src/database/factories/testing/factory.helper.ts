import type { EntityManager } from '@mikro-orm/core';

/**
 * Creates a minimal mock EntityManager that allows Factory.makeEntity()
 * to work in unit tests without a database connection.
 *
 * Factory.makeEntity() internally calls:
 *   this.em.create(this.model, data, { persist: false })
 *
 * This mock implements em.create() by instantiating the entity class
 * and assigning the provided data.
 */
export function createMockEmForFactory(): EntityManager {
  return {
    create: jest.fn(<T extends object>(EntityClass: new () => T, data: Partial<T>): T => {
      const entity = new EntityClass();
      Object.assign(entity, data);
      return entity;
    }),
  } as unknown as EntityManager;
}
