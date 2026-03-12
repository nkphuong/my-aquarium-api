import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { WaterParameter } from '@entities/water-parameter.entity';
import { IWaterParameterAccessor } from './interfaces/water-parameter.accessor.interface';

@Injectable()
export class WaterParameterAccessor
  extends Accessor(WaterParameter)
  implements IWaterParameterAccessor
{
  async findByTankId(tankId: number): Promise<WaterParameter[]> {
    // @ts-ignore
    return this.repository.find(
      { tank_id: tankId },
      { orderBy: { tested_at: 'DESC' } },
    );
  }

  async findLatestByTankId(tankId: number): Promise<WaterParameter | null> {
    // @ts-ignore
    return this.repository.findOne(
      { tank_id: tankId },
      { orderBy: { tested_at: 'DESC' } },
    );
  }
}
