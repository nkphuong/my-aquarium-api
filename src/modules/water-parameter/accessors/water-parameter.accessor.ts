import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseAccessor } from '@core/accessors/base.accessor';
import { WaterParameter } from '../entities/water-parameter.entity';
import { IWaterParameterAccessor } from './water-parameter.accessor.interface';

@Injectable()
export class WaterParameterAccessor extends BaseAccessor<WaterParameter> implements IWaterParameterAccessor {
    protected readonly entityClass = WaterParameter;

    constructor(prisma: PrismaService) {
        super(prisma);
    }

    async findByTankId(tankId: number): Promise<WaterParameter[]> {
        const items = await this.delegate.findMany({
            where: { tank_id: BigInt(tankId) },
            orderBy: { tested_at: 'desc' },
        });
        return items.map((item) => WaterParameter.fromDatabase(item));
    }

    async findLatestByTankId(tankId: number): Promise<WaterParameter | null> {
        const item = await this.delegate.findFirst({
            where: { tank_id: BigInt(tankId) },
            orderBy: { tested_at: 'desc' },
        });
        return item ? WaterParameter.fromDatabase(item) : null;
    }
}
