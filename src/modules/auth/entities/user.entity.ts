import { User as PrismaUser } from '@prisma/client';
import { Model } from '@core/mixins/model.mixin';

/**
 * User domain entity - Auto-mapped from Prisma Schema
 */
export class User extends Model<PrismaUser>() {
    // snake_case: email, password, fullname, refresh_token_hash

    // ===== Business Methods =====

    updateRefreshToken(hash: string | null): this {
        this.refresh_token_hash = hash;
        return this;
    }
}
