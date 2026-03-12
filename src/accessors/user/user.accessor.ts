import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { User } from '@entities/user.entity';
import { IUserAccessor } from './interfaces/user.accessor.interface';

@Injectable()
export class UserAccessor extends Accessor(User) implements IUserAccessor {
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email });
  }

  async findByRefreshTokenAndId(id: number, refreshToken: string): Promise<User | null> {
    return this.repository.findOne({ id, refresh_token_hash: refreshToken });
  }

  async updateRefreshToken(
    id: number,
    refreshTokenHash: string | null,
  ): Promise<User> {
    const user = await this.findByIdOrFail(id);
    user.updateRefreshToken(refreshTokenHash);
    await this.em.flush();
    return user;
  }
}
