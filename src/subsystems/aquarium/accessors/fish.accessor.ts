import { Injectable } from '@nestjs/common';
import { Fish } from '../entities/fish.entity';
import { IFishAccessor } from '../contracts/fish.accessor.interface';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';

@Injectable()
export class FishAccessor extends BaseDbAccessor implements IFishAccessor {
  async findById(id: number): Promise<Fish | null> {
    return this.em.findOne(Fish, { id });
  }

  async findAll(): Promise<Fish[]> {
    return this.em.find(Fish, {});
  }

  async findBySpecies(species: string): Promise<Fish[]> {
    return this.em.find(Fish, { species });
  }

  async findByTankId(tankId: number): Promise<Fish[]> {
    return this.em.find(Fish, { tank_id: tankId });
  }

  async save(fish: Fish): Promise<Fish> {
    await this.em.persist(fish).flush();
    return fish;
  }

  async delete(id: number): Promise<void> {
    const fish = await this.em.findOne(Fish, { id });
    if (fish) {
      await this.em.remove(fish).flush();
    }
  }
}
