import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { Livestock } from '../entities/livestock.entity';
import { ILivestockAccessor } from './livestock.accessor.interface';

@Injectable()
export class LivestockAccessor extends Accessor(Livestock) implements ILivestockAccessor {

    async findByTankId(tankId: number): Promise<Livestock[]> {
        const items = await this.delegate.findMany({
            where: { tank_id: BigInt(tankId) },
            orderBy: { created_at: 'desc' },
        });
        return items.map((item) => Livestock.fromDatabase(item));
    }
}
