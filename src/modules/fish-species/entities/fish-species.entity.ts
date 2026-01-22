import { FishSpecies as PrismaFishSpecies } from '@prisma/client';
import { Model } from '@core/mixins/model.mixin';

/**
 * FishSpecies domain entity - Auto-mapped from Prisma Schema
 * Reference data entity, mostly read-only
 */
export class FishSpecies extends Model<PrismaFishSpecies>() {
    // snake_case: name_en, name_vn, scientific_name, aliases, image_url, temp_min, temp_max, etc.
}
