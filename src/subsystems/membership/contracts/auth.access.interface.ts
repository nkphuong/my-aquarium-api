import type { MemberCredentialsDTO } from '../dtos/member-profile.dto';
import type { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import type { User } from '../entities/user.entity';
import type { Admin } from '../entities/admin.entity';

export interface AuthCredentialsResult {
  credentials: MemberCredentialsDTO;
  entity: User | Admin;
  tokenableType: string;
}

export interface IAuthAccess {
  getByCredentials(email: string): Promise<AuthCredentialsResult | null>;
  getById(id: number): Promise<UserProfileResponseDTO | null>;
}
