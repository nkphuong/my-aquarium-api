import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseAccessor, EntityClass } from '@core/accessors/base.accessor';
import { BaseEntity } from '@core/entities/base.entity';

/**
 * Mixin to create an Accessor with standard constructor injection.
 * Removes the need to write the constructor in every child class.
 * 
 * Usage:
 * export class FishAccessor extends Accessor(Fish) {}
 */
// Helper to extract instance type from constructor
type AnyEntity = BaseEntity;

export function Accessor<E extends EntityClass<any>>(Entity: E): new (prisma: PrismaService) => BaseAccessor<InstanceType<E>> {
    type T = InstanceType<E>;

    @Injectable()
    class AccessorMixin extends BaseAccessor<T> {
        constructor(@Inject(PrismaService) prisma: PrismaService) {
            super(prisma, Entity);
        }
    }
    return AccessorMixin;
}
