import { MemberProfileDTO } from './member-profile.dto';

export class StoredTokenDTO {
  id: number;
  tokenableId: number;
  tokenableType: string;
  type: string;
  expiresAt: Date;
}

export class StoredTokenWithOwnerDTO extends StoredTokenDTO {
  owner: MemberProfileDTO;
}
