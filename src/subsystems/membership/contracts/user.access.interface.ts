import type { ITransactional } from '@core/contracts/accessor.interface';
import type { IAuthAccess } from './auth.access.interface';
import type { MemberCredentialsDTO } from '../dtos/member-profile.dto';
import type { User } from '../entities/user.entity';

export interface IUserAccess extends IAuthAccess, ITransactional {
  addMember(user: User): Promise<MemberCredentialsDTO>;
}
