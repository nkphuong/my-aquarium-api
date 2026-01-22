import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { Fish } from '../entities/fish.entity';
import { IFishAccessor } from './fish.accessor.interface';

@Injectable()
export class FishAccessor extends Accessor(Fish) implements IFishAccessor {

    async findAll(): Promise<Fish[]> {
        const fishes = await this.delegate.findMany();
        return fishes.map((f) => Fish.fromDatabase(f));
    }

    async findBySpecies(species: string): Promise<Fish[]> {
        const fishes = await this.delegate.findMany({ where: { species } });
        return fishes.map((f) => Fish.fromDatabase(f));
    }
}
