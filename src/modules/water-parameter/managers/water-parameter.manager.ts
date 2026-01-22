import { Injectable, Inject } from '@nestjs/common';
import { CreateWaterParameterRequest } from '../requests/water-parameter.request';
import { WaterParameter } from '../entities/water-parameter.entity';
import { EntityNotFoundException } from '@core/exceptions/domain.exception';
import type { IWaterParameterAccessor } from '../accessors/water-parameter.accessor.interface';
import { WATER_PARAMETER_ACCESSOR } from '../accessors/water-parameter.accessor.interface';

@Injectable()
export class WaterParameterManager {
    constructor(
        @Inject(WATER_PARAMETER_ACCESSOR) private readonly waterParameterAccessor: IWaterParameterAccessor,
    ) { }

    async create(dto: CreateWaterParameterRequest): Promise<WaterParameter> {
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

        const saved = await this.waterParameterAccessor.save(entity);
        return saved;
    }

    async findByTankId(tankId: number): Promise<WaterParameter[]> {
        return this.waterParameterAccessor.findByTankId(tankId);
    }

    async findLatestByTankId(tankId: number): Promise<WaterParameter | null> {
        return this.waterParameterAccessor.findLatestByTankId(tankId);
    }

    async findById(id: number): Promise<WaterParameter> {
        const item = await this.waterParameterAccessor.findById(id);
        if (!item) {
            throw new EntityNotFoundException('WaterParameter', id);
        }
        return item;
    }

    async delete(id: number): Promise<void> {
        const item = await this.waterParameterAccessor.findById(id);
        if (!item) {
            throw new EntityNotFoundException('WaterParameter', id);
        }
        await this.waterParameterAccessor.delete(id);
    }
}
