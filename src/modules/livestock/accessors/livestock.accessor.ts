import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseAccessor } from '@core/accessors/base.accessor';
import { Livestock } from '../entities/livestock.entity';
import { ILivestockAccessor } from './livestock.accessor.interface';

@Injectable()
export class LivestockAccessor extends BaseAccessor<Livestock> implements ILivestockAccessor {
    protected readonly entityClass = Livestock;

    constructor(prisma: PrismaService) {
        super(prisma);
    }

    async findByTankId(tankId: number): Promise<Livestock[]> {
        const items = await this.delegate.findMany({
            where: { tank_id: BigInt(tankId) },
            orderBy: { created_at: 'desc' },
        });
        return items.map((item) => Livestock.fromDatabase(item));
    }
}
