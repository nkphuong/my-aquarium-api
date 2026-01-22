import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { User } from '../entities/user.entity';
import { IUserAccessor } from './user.accessor.interface';

@Injectable()
export class UserAccessor extends Accessor(User) implements IUserAccessor {

    async findByEmail(email: string): Promise<User | null> {
        return this.queryOne(this.delegate.findUnique({ where: { email } }));
    }

    async updateRefreshToken(id: number, refreshTokenHash: string | null): Promise<User> {
        return (await this.queryOne(
            this.delegate.update({
                where: { id: BigInt(id) },
                data: { refresh_token_hash: refreshTokenHash },
            }),
        ))!;
    }
}
