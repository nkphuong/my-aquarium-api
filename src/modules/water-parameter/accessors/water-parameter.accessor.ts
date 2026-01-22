import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { WaterParameter } from '../entities/water-parameter.entity';
import { IWaterParameterAccessor } from './water-parameter.accessor.interface';

@Injectable()
export class WaterParameterAccessor extends Accessor(WaterParameter) implements IWaterParameterAccessor {

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
