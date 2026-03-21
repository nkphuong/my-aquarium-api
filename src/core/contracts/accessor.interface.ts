import { EntityManager } from '@mikro-orm/core';

export interface ITransactional {
  withEntityManager(em: EntityManager): this;
}
