import { ITransactional } from '@core/contracts/accessor.interface';
import { StoredTokenDTO, StoredTokenWithOwnerDTO } from '../dtos/token.dto';

export interface IUserTokenAccess extends ITransactional {
  addToken(
    tokenableId: number,
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
}
