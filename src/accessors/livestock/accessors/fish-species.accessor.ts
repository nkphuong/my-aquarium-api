import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { FishSpecies } from '../entities/fish-species.entity';
import { IFishSpeciesAccessor } from './fish-species.accessor.interface';

@Injectable()
export class FishSpeciesAccessor
  extends Accessor(FishSpecies)
  implements IFishSpeciesAccessor
{
  // Override toDbId to return number for Int ID field (not BigInt)
  // Override toDbId to return number for Int ID field (not BigInt)
  // REMOVED: BaseAccessor uses repository which handles this via entity metadata

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

    return this.repository.find(where, {
      orderBy: { name_en: 'asc' },
    });
  }

  // Override save to handle upsert by name
  override async save(entity: FishSpecies): Promise<FishSpecies> {
    if (entity.exists) {
      return this.update(entity.id, entity);
    }

    // Check for existing by name_en before creating
    const existing = await this.repository.findOne({ name_en: entity.name_en });

    if (existing) {
      // Logic for upsert: update existing if found by name
      // Use wrap(existing).assign(entity) but skip ID and timestamps if needed
      // entity is a new instance with data.
      // We want to merge entity's data into existing.
      // Using assign(entity) might copy undefined props if strict?
      // MikroORM assign is usually smart.

      // However, entity passed in is an Entity object, not a POJO.
      // Converting to POJO first might be safer if assign expects DTO.
      const data = entity.toJSON(); // assuming toJSON returns clean data
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;

      // Re-assign entity props to existing
      this.em.assign(existing, data);
      await this.em.flush();
      return existing;
    }

    return this.create(entity);
  }
}
