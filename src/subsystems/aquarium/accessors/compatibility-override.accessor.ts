import { Injectable } from '@nestjs/common';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { CompatibilityOverride } from '../entities/compatibility-override.entity';
import { ICompatibilityOverrideAccessor } from '../contracts/compatibility-override.accessor.interface';

@Injectable()
export class CompatibilityOverrideAccessor
  extends BaseDbAccessor
  implements ICompatibilityOverrideAccessor
{
  async findBySpeciesSet(
    speciesIds: number[],
  ): Promise<CompatibilityOverride[]> {
    if (speciesIds.length === 0) return [];
    return this.em.find(CompatibilityOverride, {
      $or: [
        {
          species_a_id: { $in: speciesIds },
          species_b_id: { $in: speciesIds },
        },
      ],
    });
  }

  async findByPair(
    speciesAId: number,
    speciesBId: number,
  ): Promise<CompatibilityOverride | null> {
    return this.em.findOne(CompatibilityOverride, {
      $or: [
        { species_a_id: speciesAId, species_b_id: speciesBId },
        { species_a_id: speciesBId, species_b_id: speciesAId },
      ],
    });
  }
}
