import { Injectable } from '@nestjs/common';
import { FishSpecies } from '../entities/fish-species.entity';
import { IFishSpeciesAccessor } from '../contracts/fish-species.accessor.interface';

import { BaseDbAccessor } from '@core/accessors/base-db.accessor';

@Injectable()
export class FishSpeciesAccessor
  extends BaseDbAccessor
  implements IFishSpeciesAccessor
{
  async findById(id: number): Promise<FishSpecies | null> {
    return this.em.findOne(FishSpecies, { id });
  }

  async findAll(keyword?: string): Promise<FishSpecies[]> {
    const filters: any[] = [];

    if (keyword) {
      const like = `%${keyword}%`;
      filters.push({ name_en: { $ilike: like } });
      filters.push({ name_vn: { $ilike: like } });
      filters.push({ scientific_name: { $ilike: like } });
      // For array contains in Postgres with MikroORM
      filters.push({ aliases: { $contains: [keyword] } });
    }

    const where = filters.length > 0 ? { $or: filters } : {};

    return this.em.find(FishSpecies, where, {
      orderBy: { name_en: 'asc' },
    });
  }
}
