import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { Livestock } from '@entities/livestock.entity';
import { ILivestockAccessor } from './interfaces/livestock.accessor.interface';

@Injectable()
export class LivestockAccessor
  extends Accessor(Livestock)
  implements ILivestockAccessor
{
  async findByTankId(tankId: number): Promise<Livestock[]> {
    // @ts-ignore
    return this.repository.find(
      { tank_id: tankId },
      { orderBy: { createdAt: 'DESC' } },
    );
  }
}
