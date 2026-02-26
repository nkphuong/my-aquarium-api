import { Injectable, Inject } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { BaseAccessor, EntityClass } from '@core/accessors/base.accessor';

/**
 * Mixin to create an Accessor with standard constructor injection.
 * Removes the need to write the constructor in every child class.
 *
 * Usage:
 * export class FishAccessor extends Accessor(Fish) {}
 */

export function Accessor<E extends EntityClass<any>>(
  Entity: E,
): new (em: EntityManager) => BaseAccessor<InstanceType<E>> {
  type T = InstanceType<E>;

  @Injectable()
  class AccessorMixin extends BaseAccessor<T> {
    constructor(em: EntityManager) {
      super(em, Entity);
    }
  }
  return AccessorMixin;
}
