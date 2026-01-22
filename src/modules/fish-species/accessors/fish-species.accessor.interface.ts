import { FishSpecies } from '../entities/fish-species.entity';

export interface IFishSpeciesAccessor {
    findById(id: number): Promise<FishSpecies | null>;
    findAll(keyword?: string): Promise<FishSpecies[]>;
    save(fishSpecies: FishSpecies): Promise<FishSpecies>;
    delete(id: number): Promise<void>;
}

export const FISH_SPECIES_ACCESSOR = Symbol('IFishSpeciesAccessor');
