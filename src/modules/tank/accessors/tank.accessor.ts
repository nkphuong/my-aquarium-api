import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseAccessor } from '@core/accessors/base.accessor';
import { Tank } from '../entities/tank.entity';
import { ITankAccessor, PaginatedTanks } from './tank.accessor.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class TankAccessor extends BaseAccessor<Tank> implements ITankAccessor {
    protected readonly entityClass = Tank;

    constructor(prisma: PrismaService) {
        super(prisma);
    }

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
        const tanks = await this.delegate.findMany({ where });
        return tanks.map((t) => Tank.fromDatabase(t));
    }
}
