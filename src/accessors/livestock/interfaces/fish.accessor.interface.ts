import { Fish } from '@entities/fish.entity';

export interface IFishAccessor {
  findById(id: number): Promise<Fish | null>;
  findAll(): Promise<Fish[]>;
  findBySpecies(species: string): Promise<Fish[]>;
  findByTankId(tankId: number): Promise<Fish[]>;
  save(fish: Fish): Promise<Fish>;
  delete(id: number): Promise<void>;
}

export const FISH_ACCESSOR = Symbol('IFishAccessor');
