import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { Fish } from '@entities/fish.entity';
import { IFishAccessor } from './interfaces/fish.accessor.interface';

@Injectable()
export class FishAccessor extends Accessor(Fish) implements IFishAccessor {
  async findAll(): Promise<Fish[]> {
    return this.repository.findAll();
  }

  async findBySpecies(species: string): Promise<Fish[]> {
    return this.repository.find({ species });
  }

  async findByTankId(tankId: number): Promise<Fish[]> {
    // @ts-ignore - tank_id is bigint in DB, number in entity
    return this.repository.find({ tank_id: tankId });
  }
}
