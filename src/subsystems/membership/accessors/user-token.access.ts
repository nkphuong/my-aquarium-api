import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { IUserTokenAccess } from '../contracts/user-token.access.interface';
import { UserToken } from '../entities/user-token.entity';
import type { User } from '../entities/user.entity';
import type { Admin } from '../entities/admin.entity';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { StoredTokenDTO, StoredTokenWithOwnerDTO } from '../dtos/token.dto';

@Injectable()
export class UserTokenAccess
  extends BaseDbAccessor
  implements IUserTokenAccess
{
  public async addToken(
    tokenable: User | Admin,
    tokenableType: string,
    tokenHash: string,
    expiresAt: Date,
    type?: string,
  ): Promise<void> {
    try {
      const token = this.em.create(UserToken, {
        tokenable,
        tokenableType,
        tokenHash,
        expiresAt,
        type: type ?? 'refresh',
        createdAt: new Date(),
      });
      await this.em.persist(token).flush();
    } catch (error: unknown) {
      this.logger.logError(
        `DB error when add token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Infrastructure error.');
    }
  }

  public async findByHash(tokenHash: string): Promise<StoredTokenDTO | null> {
    try {
      const token = await this.em.findOne(UserToken, { tokenHash });
      if (!token) return null;
      return {
        id: token.id,
        tokenableId: token.tokenable.id,
        tokenableType: token.tokenableType,
        type: token.type,
        expiresAt: token.expiresAt,
      };
    } catch (error: unknown) {
      this.logger.logError(
        `DB error when finding token by hash: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Infrastructure error.');
    }
  }

  public async findByHashWithOwner(
    tokenHash: string,
  ): Promise<StoredTokenWithOwnerDTO | null> {
    try {
      const token = await this.em.findOne(
        UserToken,
        { tokenHash },
        { populate: ['tokenable'] },
      );
      if (!token) return null;

      const user = token.tokenable;
      return {
        id: token.id,
        tokenableId: user.id,
        tokenableType: token.tokenableType,
        type: token.type,
        expiresAt: token.expiresAt,
        owner: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
        },
      };
    } catch (error: unknown) {
      this.logger.logError(
        `DB error when finding token with owner: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Infrastructure error.');
    }
  }

  public async revokeToken(tokenId: number): Promise<void> {
    try {
      await this.em.nativeDelete(UserToken, { id: tokenId });
    } catch (error: unknown) {
      this.logger.logError(
        `DB error when revoking token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Infrastructure error.');
    }
  }

  public async revokeByHash(tokenHash: string): Promise<void> {
    try {
      await this.em.nativeDelete(UserToken, { tokenHash });
    } catch (error: unknown) {
      this.logger.logError(
        `DB error when revoking token by hash: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Infrastructure error.');
    }
  }

  public async revokeByUserIdAndType(
    userId: number,
    type: string,
  ): Promise<void> {
    try {
      await this.em.nativeDelete(UserToken, { tokenable: userId, type });
    } catch (error: unknown) {
      this.logger.logError(
        `DB error when revoking token by user and type: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Infrastructure error.');
    }
  }

  public async findByHashAndEmail(
    tokenHash: string,
    email: string,
  ): Promise<StoredTokenWithOwnerDTO | null> {
    try {
      const token = await this.em.findOne(
        UserToken,
        { tokenHash, type: 'email_verification', tokenableType: 'users' },
        { populate: ['tokenable'] },
      );

      if (!token) return null;

      const tokenable = token.tokenable;
      if (tokenable.email !== email) return null;

      return {
        id: token.id,
        tokenableId: tokenable.id,
        tokenableType: token.tokenableType,
        type: token.type,
        expiresAt: token.expiresAt,
        owner: {
          id: tokenable.id,
          email: tokenable.email,
          fullname: tokenable.fullname,
        },
      };
    } catch (error: unknown) {
      this.logger.logError(
        `DB error when finding token by hash and email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Infrastructure error.');
    }
  }
}
