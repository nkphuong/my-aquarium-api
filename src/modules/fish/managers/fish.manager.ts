import { Injectable, Inject } from '@nestjs/common';
import { Fish } from '../entities/fish.entity';
import { FishNotFoundException } from '../exceptions';
import type { IFishAccessor } from '../accessors/fish.accessor.interface';
import { FISH_ACCESSOR } from '../accessors/fish.accessor.interface';

@Injectable()
export class FishManager {
    constructor(
        @Inject(FISH_ACCESSOR) private readonly fishAccessor: IFishAccessor,
    ) { }

    async create(data: { name: string; species: string; tankId?: number }): Promise<Fish> {
        const fish = new Fish();
        fish.fill({
            name: data.name,
            species: data.species,
            tank_id: data.tankId,
        } as any);

        const saved = await this.fishAccessor.save(fish);
        return saved;
    }

    async findAll(): Promise<Fish[]> {
        return this.fishAccessor.findAll();
    }

    async findById(id: number): Promise<Fish> {
        const fish = await this.fishAccessor.findById(id);
        if (!fish) {
            throw new FishNotFoundException(id);
        }
        return fish;
    }

    async findBySpecies(species: string): Promise<Fish[]> {
        return this.fishAccessor.findBySpecies(species);
    }

    async assignToTank(fishId: number, tankId: number): Promise<Fish> {
        const fish = await this.fishAccessor.findById(fishId);
        if (!fish) {
            throw new FishNotFoundException(fishId);
        }
        fish.assignToTank(tankId);
        return this.fishAccessor.save(fish);
    }

    async delete(id: number): Promise<void> {
        const fish = await this.fishAccessor.findById(id);
        if (!fish) {
            throw new FishNotFoundException(id);
        }
        await this.fishAccessor.delete(id);
    }
}
