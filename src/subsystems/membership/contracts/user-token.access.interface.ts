import type { ITransactional } from '@core/contracts/accessor.interface';
import type {
  StoredTokenDTO,
  StoredTokenWithOwnerDTO,
} from '../dtos/token.dto';
import type { User } from '../entities/user.entity';
import type { Admin } from '../entities/admin.entity';

export interface IUserTokenAccess extends ITransactional {
  addToken(
    tokenable: User | Admin,
    tokenableType: string,
    tokenHash: string,
    expiresAt: Date,
    type?: string,
  ): Promise<void>;
  findByHash(tokenHash: string): Promise<StoredTokenDTO | null>;
  findByHashWithOwner(
    tokenHash: string,
  ): Promise<StoredTokenWithOwnerDTO | null>;
  revokeToken(tokenId: number): Promise<void>;
  revokeByHash(tokenHash: string): Promise<void>;
  revokeByUserIdAndType(userId: number, type: string): Promise<void>;
  findByHashAndEmail(
    tokenHash: string,
    email: string,
  ): Promise<StoredTokenWithOwnerDTO | null>;
}
