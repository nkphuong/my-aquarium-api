import { ITransactional } from '@core/contracts/accessor.interface';
import { MemberCredentialsDTO } from '../dtos/member-profile.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import { User } from '../entities/user.entity';

export interface IMemberAccess extends ITransactional {
  getMemberByCredentials(
    credentials: string,
  ): Promise<MemberCredentialsDTO | null>;
  addMember(user: User): Promise<MemberCredentialsDTO>;
  getMemberById(id: number): Promise<UserProfileResponseDTO | null>;
}
