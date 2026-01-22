import { Fish as PrismaFish } from '@prisma/client';
import { Model } from '@core/mixins/model.mixin';

/**
 * Fish domain entity - Auto-mapped from Prisma Schema
 */
export class Fish extends Model<PrismaFish>() {
    // snake_case properties: name, species, tank_id

    // ===== Business Methods =====

    assignToTank(tankId: number): this {
        this.tank_id = tankId;
        return this;
    }

    removeFromTank(): this {
        this.tank_id = null;
        return this;
    }
}
