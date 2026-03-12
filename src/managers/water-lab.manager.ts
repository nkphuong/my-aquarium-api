import { Injectable, Inject } from '@nestjs/common';
import { WaterParameter } from '@entities/water-parameter.entity';

// Accessors
import type { IWaterParameterAccessor } from '@accessors/aquarium/interfaces/water-parameter.accessor.interface';
import { WATER_PARAMETER_ACCESSOR } from '@accessors/aquarium/interfaces/water-parameter.accessor.interface';

// Exceptions
import { WaterParameterNotFoundException } from '../exceptions';

// Requests
import { ICreateWaterParameterCommand } from './interfaces/water-lab.manager.interface';

@Injectable()
export class WaterLabManager {
  constructor(
    @Inject(WATER_PARAMETER_ACCESSOR)
    private readonly waterParameterAccessor: IWaterParameterAccessor,
  ) { }

  // ===== Water Parameter CRUD & Analysis =====

  async logWaterParameters(
    dto: ICreateWaterParameterCommand,
  ): Promise<WaterParameter> {
    const entity = new WaterParameter();
    entity.fill({
      tank_id: dto.tankId,
      tested_at: dto.testedAt ? new Date(dto.testedAt) : new Date(),
      temperature: dto.temperature,
      ph: dto.ph,
      ammonia: dto.ammonia,
      nitrite: dto.nitrite,
      nitrate: dto.nitrate,
      gh: dto.gh,
      kh: dto.kh,
      notes: dto.notes,
    } as any);
    return this.waterParameterAccessor.save(entity);
  }

  async findWaterParametersByTankId(tankId: number): Promise<WaterParameter[]> {
    return this.waterParameterAccessor.findByTankId(tankId);
  }

  async findLatestWaterParameters(
    tankId: number,
  ): Promise<WaterParameter | null> {
    return this.waterParameterAccessor.findLatestByTankId(tankId);
  }

  async findWaterParameterById(id: number): Promise<WaterParameter> {
    const param = await this.waterParameterAccessor.findById(id);
    if (!param) throw new WaterParameterNotFoundException(id);
    return param;
  }

  async deleteWaterParameter(id: number): Promise<void> {
    const param = await this.waterParameterAccessor.findById(id);
    if (!param) throw new WaterParameterNotFoundException(id);
    await this.waterParameterAccessor.delete(id);
  }
}
