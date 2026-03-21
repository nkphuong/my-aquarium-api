import { Injectable } from '@nestjs/common';
import { WaterParameter } from '../entities/water-parameter.entity';
import { IWaterParameterAccessor } from '../contracts/water-parameter.accessor.interface';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';

@Injectable()
export class WaterParameterAccessor
  extends BaseDbAccessor
  implements IWaterParameterAccessor
{
  async findById(id: number): Promise<WaterParameter | null> {
    return this.em.findOne(WaterParameter, { id });
  }

  async findByTankId(tankId: number): Promise<WaterParameter[]> {
    return this.em.find(
      WaterParameter,
      { tank_id: tankId },
      { orderBy: { tested_at: 'DESC' } },
    );
  }

  async findLatestByTankId(tankId: number): Promise<WaterParameter | null> {
    return this.em.findOne(
      WaterParameter,
      { tank_id: tankId },
      { orderBy: { tested_at: 'DESC' } },
    );
  }

  async save(waterParameter: WaterParameter): Promise<WaterParameter> {
    await this.em.persist(waterParameter).flush();
    return waterParameter;
  }

  async delete(id: number): Promise<void> {
    const param = await this.em.findOne(WaterParameter, { id });
    if (param) {
      await this.em.remove(param).flush();
    }
  }
}
