import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Admin } from '../entities/admin.entity';
import { MemberCredentialsDTO } from '../dtos/member-profile.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import type { IAdminAccess } from '../contracts/admin.access.interface';
import type { AuthCredentialsResult } from '../contracts/auth.access.interface';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';

@Injectable()
export class AdminAccess extends BaseDbAccessor implements IAdminAccess {
  public async getByCredentials(
    email: string,
  ): Promise<AuthCredentialsResult | null> {
    try {
      const admin = await this.em.findOne(Admin, { email });

      if (!admin) return null;

      const credentials = new MemberCredentialsDTO();
      credentials.id = admin.id;
      credentials.email = admin.email;
      credentials.hashedPassword = admin.password;
      credentials.fullname = admin.fullname ?? undefined;
      credentials.verifiedAt = admin.verifiedAt;

      return {
        credentials,
        entity: admin,
        tokenableType: 'admin',
      };
    } catch (error: unknown) {
      this.logger.logError(
        `Error when get admin by credentials: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException(
        'Error when get admin by credentials.',
      );
    }
  }

  public async getById(
    id: number,
  ): Promise<UserProfileResponseDTO | null> {
    try {
      const admin = await this.em.findOne(Admin, { id });

      if (!admin) return null;

      const profile = new UserProfileResponseDTO();
      profile.id = admin.id;
      profile.email = admin.email;
      profile.fullname = admin.fullname ?? null;

      return profile;
    } catch (error: unknown) {
      this.logger.logError(
        `Error when get admin by id: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Error when get admin by id.');
    }
  }
}
