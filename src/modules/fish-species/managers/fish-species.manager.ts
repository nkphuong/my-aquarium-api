import { Injectable, Inject } from '@nestjs/common';
import { FishSpecies } from '../entities/fish-species.entity';
import { FishSpeciesNotFoundException } from '../exceptions';
import type { IFishSpeciesAccessor } from '../accessors/fish-species.accessor.interface';
import { FISH_SPECIES_ACCESSOR } from '../accessors/fish-species.accessor.interface';

@Injectable()
export class FishSpeciesManager {
    constructor(
        @Inject(FISH_SPECIES_ACCESSOR) private readonly fishSpeciesAccessor: IFishSpeciesAccessor,
    ) { }

    async findAll(keyword?: string): Promise<FishSpecies[]> {
        return this.fishSpeciesAccessor.findAll(keyword);
    }

    async findById(id: number): Promise<FishSpecies> {
        const species = await this.fishSpeciesAccessor.findById(id);
        if (!species) {
            throw new FishSpeciesNotFoundException(id);
        }
        return species;
    }

    async save(entity: FishSpecies): Promise<FishSpecies> {
        return this.fishSpeciesAccessor.save(entity);
    }

    async delete(id: number): Promise<void> {
        const species = await this.fishSpeciesAccessor.findById(id);
        if (!species) {
            throw new FishSpeciesNotFoundException(id);
        }
        await this.fishSpeciesAccessor.delete(id);
    }
}
