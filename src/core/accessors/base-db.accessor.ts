import { Injectable, Inject } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { BaseAccessor } from './base.accessor';
import type { ILoggingUtility } from '@utilities/logging/logging.utility.interface';

@Injectable()
export abstract class BaseDbAccessor extends BaseAccessor {
  constructor(
    @Inject(EntityManager) protected readonly em: EntityManager,
    @Inject('ILoggingUtility') logger: ILoggingUtility,
  ) {
    super(logger);
  }

  /**
   * Create a shallow copy of this accessor bound to a transactional EntityManager.
   * Managers call this inside em.transactional() to pass the forked EM down.
   */
  withEntityManager(em: EntityManager): this {
    const clone = Object.create(Object.getPrototypeOf(this) as object) as this;
    return Object.assign(clone, this, { em });
  }

  /**
   * Get a repository for any entity class from the current EM.
   */
  protected repo<T extends object>(
    entityClass: new () => T,
  ): EntityRepository<T> {
    return this.em.getRepository(entityClass) as EntityRepository<T>;
  }
}
