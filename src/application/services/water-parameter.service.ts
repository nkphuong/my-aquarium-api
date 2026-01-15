import { Injectable } from '@nestjs/common';
import { WaterParameterRepository } from '@infrastructure/repositories/water-parameter.repository';
import { CreateWaterParameterDto, WaterParameterDto } from '@application/dtos/water-parameter.dto';
import { WaterParameter } from '@domain/entities/water-parameter.entity';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class WaterParameterService {
    constructor(private readonly repository: WaterParameterRepository) { }

    async create(dto: CreateWaterParameterDto): Promise<WaterParameterDto> {
        const entity = new WaterParameter(
            0,
            dto.tankId,
            dto.testedAt ? new Date(dto.testedAt) : new Date(),
            dto.temperature,
            dto.ph,
            dto.ammonia,
            dto.nitrite,
            dto.nitrate,
            dto.gh,
            dto.kh,
            dto.notes,
        );
        const saved = await this.repository.create(entity);
        return WaterParameterDto.fromEntity(saved);
    }

    async findByTankId(tankId: number): Promise<WaterParameterDto[]> {
        const items = await this.repository.findByTankId(tankId);
        return WaterParameterDto.fromEntities(items);
    }

    async findLatestByTankId(tankId: number): Promise<WaterParameterDto | null> {
        const item = await this.repository.findLatestByTankId(tankId);
        return item ? WaterParameterDto.fromEntity(item) : null;
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
