import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { Tank } from '../entities/tank.entity';
import { ITankAccessor, PaginatedTanks } from './tank.accessor.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class TankAccessor extends Accessor(Tank) implements ITankAccessor {

    async findAll(
        page: number = 1,
        perPage: number = 10,
        includeArchived: boolean = false,
    ): Promise<PaginatedTanks> {
        const where: Prisma.TankWhereInput = includeArchived
            ? {}
            : { is_archived: false };

        const [tanks, meta] = await this.prisma.extended.tank.paginate().withPages({
            limit: perPage,
            page,
            includePageCount: true,
            where,
        });

        return {
            data: tanks.map((t) => Tank.fromDatabase(t)),
            meta: {
                total: meta.totalCount,
                lastPage: meta.pageCount,
                currentPage: meta.currentPage,
                perPage: perPage,
                prev: meta.previousPage,
                next: meta.nextPage,
            },
        };
    }

    async findByUserId(userId: number, includeArchived: boolean = false): Promise<Tank[]> {
        const where: Prisma.TankWhereInput = {
            user_id: BigInt(userId),
            ...(includeArchived ? {} : { is_archived: false }),
        };
        return this.queryMany(this.delegate.findMany({ where }));
    }
}
