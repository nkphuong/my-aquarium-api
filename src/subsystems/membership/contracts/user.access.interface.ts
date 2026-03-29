import type { ITransactional } from '@core/contracts/accessor.interface';
import type { IAuthAccess } from './auth.access.interface';
import type { MemberCredentialsDTO } from '../dtos/member-profile.dto';
import type { User } from '../entities/user.entity';

export interface ListUsersQuery {
  page: number;
  limit: number;
  search?: string;
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IUserAccess extends IAuthAccess, ITransactional {
  addMember(user: User): Promise<MemberCredentialsDTO>;
  findEntityById(id: number): Promise<User | null>;
  listUsers(query: ListUsersQuery): Promise<{ items: User[]; total: number }>;
  updateUser(id: number, data: Partial<User>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  verifyEmail(userId: number): Promise<void>;
  updatePassword(userId: number, hashedPassword: string): Promise<void>;
  getByEmail(email: string): Promise<User | null>;
}
