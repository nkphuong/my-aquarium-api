import { Injectable } from '@nestjs/common';
import { Livestock } from '../entities/livestock.entity';
import { ILivestockAccessor } from '../contracts/livestock.accessor.interface';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';

@Injectable()
export class LivestockAccessor
  extends BaseDbAccessor
  implements ILivestockAccessor
{
  async findById(id: number): Promise<Livestock | null> {
    return this.em.findOne(Livestock, { id });
  }

  async findByTankId(tankId: number): Promise<Livestock[]> {
    return this.em.find(
      Livestock,
      { tank_id: tankId },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  async save(livestock: Livestock): Promise<Livestock> {
    await this.em.persist(livestock).flush();
    return livestock;
  }

  async update(id: number, livestock: Livestock): Promise<Livestock> {
    this.em.assign(livestock, { id });
    await this.em.flush();
    return livestock;
  }

  async delete(id: number): Promise<void> {
    const livestock = await this.em.findOne(Livestock, { id });
    if (livestock) {
      await this.em.remove(livestock).flush();
    }
  }
}
