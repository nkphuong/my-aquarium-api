import { Injectable } from '@nestjs/common';
import { FishSpeciesRepository } from '@infrastructure/repositories/fish-species.repository';
import { FishSpeciesDto } from '@application/dtos/fish-species.dto';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class FishSpeciesService {
    constructor(private readonly repository: FishSpeciesRepository) { }

    async findAll(keyword?: string): Promise<FishSpeciesDto[]> {
        const items = await this.repository.findAll(keyword);
        return FishSpeciesDto.fromEntities(items);
    }

    async findById(id: number): Promise<FishSpeciesDto> {
        const item = await this.repository.findById(id);
        if (!item) {
            throw new EntityNotFoundException('FishSpecies', id);
        }
        return FishSpeciesDto.fromEntity(item);
    }
}
