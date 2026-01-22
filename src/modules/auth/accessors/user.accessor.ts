import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseAccessor } from '@core/accessors/base.accessor';
import { User } from '../entities/user.entity';
import { IUserAccessor } from './user.accessor.interface';

@Injectable()
export class UserAccessor extends BaseAccessor<User> implements IUserAccessor {
    protected readonly entityClass = User;

    constructor(prisma: PrismaService) {
        super(prisma);
    }

    async findByEmail(email: string): Promise<User | null> {
        const data = await this.delegate.findUnique({ where: { email } });
        return data ? User.fromDatabase(data) : null;
    }

    async updateRefreshToken(id: number, refreshTokenHash: string | null): Promise<User> {
        const data = await this.delegate.update({
            where: { id: BigInt(id) },
            data: { refresh_token_hash: refreshTokenHash },
        });
        return User.fromDatabase(data);
    }
}
