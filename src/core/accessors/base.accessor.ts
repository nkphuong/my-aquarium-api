import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  wrap,
} from '@mikro-orm/core';
import { BaseEntity } from '@core/entities/base.entity';
import { EntityNotFoundException } from '@core/exceptions/domain.exception';

export interface EntityClass<T extends BaseEntity> {
  new (): T;
}

/**
 * Base accessor with common CRUD operations using MikroORM
 */
@Injectable()
export abstract class BaseAccessor<T extends BaseEntity> {
  protected readonly repository: EntityRepository<T>;

  constructor(
    protected readonly em: EntityManager,
    protected readonly entityClass: EntityClass<T>,
  ) {
    this.repository = em.getRepository(entityClass);
  }

  /**
   * Set a transactional EntityManager for this accessor
   */
  withEntityManager(em: EntityManager): this {
    const accessor = Object.create(Object.getPrototypeOf(this));
    return Object.assign(accessor, this, {
      em,
      repository: em.getRepository(this.entityClass),
    });
  }

  async findById(id: number): Promise<T | null> {
    // @ts-ignore - ID type mismatch (number vs BigInt) handled by driver
    return this.repository.findOne({ id });
  }

  /**
   * Find by ID or throw EntityNotFoundException
   */
  async findByIdOrFail(id: number): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new EntityNotFoundException(this.entityClass.name, id);
    }
    return entity;
  }

  async save(entity: T): Promise<T> {
    if (entity.exists) {
      return this.update(entity.id, entity);
    }
    return this.create(entity);
  }

  async create(entity: T): Promise<T> {
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async update(id: number, entity: T): Promise<T> {
    // @ts-ignore
    const existing = await this.repository.findOneOrFail({ id });
    wrap(existing).assign(entity as any);
    await this.em.flush();
    return existing;
  }

  async delete(id: number): Promise<void> {
    // @ts-ignore
    const reference = this.repository.getReference(id);
    await this.em.removeAndFlush(reference);
  }
}
