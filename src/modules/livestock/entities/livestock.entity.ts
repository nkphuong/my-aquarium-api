import { Livestock as PrismaLivestock } from '@prisma/client';
import { Model } from '@core/mixins/model.mixin';

/**
 * Livestock domain entity - Auto-mapped from Prisma Schema
 */
export class Livestock extends Model<PrismaLivestock>() {
    // snake_case properties are now auto-defined by WithSchema<PrismaLivestock>

    // ===== Business Methods =====

    updateQuantity(qty: number): this {
        this.quantity = qty;
        return this;
    }

    updateStatus(status: string): this {
        this.status = status;
        return this;
    }

    assignToTank(tankId: number): this {
        this.tank_id = tankId; // Now using correct schema column name
        return this;
    }

    removeFromTank(): this {
        this.tank_id = null;
        return this;
    }
}
