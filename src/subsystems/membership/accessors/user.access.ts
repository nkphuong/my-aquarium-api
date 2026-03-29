import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { FilterQuery } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { MemberCredentialsDTO } from '../dtos/member-profile.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import type {
  IUserAccess,
  ListUsersQuery,
} from '../contracts/user.access.interface';
import type { AuthCredentialsResult } from '../contracts/auth.access.interface';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { mustVerifyEmail } from '../guards/must-verify-email.guard';

@Injectable()
export class UserAccess extends BaseDbAccessor implements IUserAccess {
  public async getByCredentials(
    email: string,
  ): Promise<AuthCredentialsResult | null> {
    try {
      const user = await this.em.findOne(User, { email });

      if (!user) return null;

      const credentials = new MemberCredentialsDTO();
      credentials.id = user.id;
      credentials.email = user.email;
      credentials.hashedPassword = user.password;
      credentials.fullname = user.fullname ?? undefined;
      credentials.verifiedAt = user.verifiedAt;

      return {
        credentials,
        entity: user,
        tokenableType: 'user',
      };
    } catch (error: unknown) {
      this.logger.logError(
        `Error when get member by credentials: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException(
        'Error when get member by credentials.',
      );
    }
  }

  public async addMember(user: User): Promise<MemberCredentialsDTO> {
    try {
      await this.em.persist(user).flush();

      const profile = new MemberCredentialsDTO();
      profile.id = user.id;
      profile.email = user.email;
      profile.hashedPassword = user.password;
      profile.fullname = user.fullname ?? undefined;

      profile.verifiedAt = user.verifiedAt;
      profile.needsEmailVerification =
        mustVerifyEmail(user) && !user.hasVerifiedEmail();

      return profile;
    } catch (error: unknown) {
      this.logger.logError(
        `Error when add member: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when add member.');
    }
  }

  public async findEntityById(id: number): Promise<User | null> {
    try {
      return await this.em.findOne(User, { id });
    } catch (error: unknown) {
      this.logger.logError(
        `Error when find entity by id: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when find entity by id.');
    }
  }

  public async getById(id: number): Promise<UserProfileResponseDTO | null> {
    try {
      const user = await this.em.findOne(User, { id });

      if (!user) return null;

      const profile = new UserProfileResponseDTO();
      profile.id = user.id;
      profile.email = user.email;
      profile.fullname = user.fullname ?? null;

      return profile;
    } catch (error: unknown) {
      this.logger.logError(
        `Error when get member by id: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when get member by id.');
    }
  }

  public async listUsers(
    query: ListUsersQuery,
  ): Promise<{ items: User[]; total: number }> {
    try {
      const where: FilterQuery<User> = {};
      const conditions: FilterQuery<User>[] = [];

      if (query.search) {
        conditions.push({
          $or: [
            { email: { $like: `%${query.search}%` } },
            { fullname: { $like: `%${query.search}%` } },
          ],
        });
      }

      if (query.isVerified === true) {
        conditions.push({ verifiedAt: { $ne: null } });
      } else if (query.isVerified === false) {
        conditions.push({ verifiedAt: null });
      }

      if (conditions.length > 0) {
        Object.assign(where, { $and: conditions });
      }

      const offset = (query.page - 1) * query.limit;
      const orderBy: Record<string, 'asc' | 'desc'> = {
        [query.sortBy ?? 'id']: query.sortOrder ?? 'desc',
      };

      const [items, total] = await this.em.findAndCount(User, where, {
        limit: query.limit,
        offset,
        orderBy,
      });

      return { items, total };
    } catch (error: unknown) {
      this.logger.logError(
        `Error when list users: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when list users.');
    }
  }

  public async updateUser(
    id: number,
    data: Partial<User>,
  ): Promise<User | null> {
    try {
      const user = await this.em.findOne(User, { id });
      if (!user) return null;

      user.fill(data);
      await this.em.flush();

      return user;
    } catch (error: unknown) {
      this.logger.logError(
        `Error when update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when update user.');
    }
  }

  public async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await this.em.findOne(User, { id });
      if (!user) return false;

      await this.em.remove(user).flush();
      return true;
    } catch (error: unknown) {
      this.logger.logError(
        `Error when delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when delete user.');
    }
  }

  public async verifyEmail(userId: number): Promise<void> {
    try {
      const user = await this.em.findOneOrFail(User, { id: userId });
      user.markEmailAsVerified();
      await this.em.flush();
    } catch (error: unknown) {
      this.logger.logError(
        `Error when verifying email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when verifying email.');
    }
  }

  public async updatePassword(
    userId: number,
    hashedPassword: string,
  ): Promise<void> {
    try {
      const user = await this.em.findOneOrFail(User, { id: userId });
      user.password = hashedPassword;
      await this.em.flush();
    } catch (error: unknown) {
      this.logger.logError(
        `Error when updating password: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when updating password.');
    }
  }

  public async getByEmail(email: string): Promise<User | null> {
    try {
      return await this.em.findOne(User, { email });
    } catch (error: unknown) {
      this.logger.logError(
        `Error when get user by email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when get user by email.');
    }
  }
}
