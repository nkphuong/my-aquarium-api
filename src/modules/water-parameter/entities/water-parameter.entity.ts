import { WaterParameter as PrismaWaterParameter } from '@prisma/client';
import { Model } from '@core/mixins/model.mixin';

/**
 * WaterParameter domain entity - Auto-mapped from Prisma Schema
 */
export class WaterParameter extends Model<PrismaWaterParameter>() {
    // snake_case: tank_id, tested_at
}
