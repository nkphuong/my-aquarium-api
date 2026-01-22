import { Tank as PrismaTank } from '@prisma/client';
import { Model } from '@core/mixins/model.mixin';

/**
 * Tank domain entity - Auto-mapped from Prisma Schema
 */
export class Tank extends Model<PrismaTank>() {
    // snake_case properties are auto-defined

    get volume(): number {
        return this.volume_liters ?? 0;
    }

    get dimensions(): string {
        return `${this.length}x${this.width}x${this.height}`;
    }

    assignToUser(userId: number): this {
        this.user_id = userId;
        return this;
    }

    removeFromUser(): this {
        this.user_id = null;
        return this;
    }

    archive(): this {
        this.is_archived = true;
        return this;
    }

    unarchive(): this {
        this.is_archived = false;
        return this;
    }
}
