import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { MemberCredentialsDTO } from '../dtos/member-profile.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import type { IUserAccess } from '../contracts/user.access.interface';
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

  public async getById(
    id: number,
  ): Promise<UserProfileResponseDTO | null> {
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
}
