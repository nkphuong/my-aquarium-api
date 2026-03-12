import { WaterParameter } from '@entities/water-parameter.entity';

export interface IWaterParameterAccessor {
  findById(id: number): Promise<WaterParameter | null>;
  findByTankId(tankId: number): Promise<WaterParameter[]>;
  findLatestByTankId(tankId: number): Promise<WaterParameter | null>;
  save(waterParameter: WaterParameter): Promise<WaterParameter>;
  delete(id: number): Promise<void>;
}

export const WATER_PARAMETER_ACCESSOR = Symbol('IWaterParameterAccessor');
