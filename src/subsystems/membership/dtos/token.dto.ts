import { MemberProfileDTO } from './member-profile.dto';

export class StoredTokenDTO {
  id: number;
  tokenableId: number;
  tokenableType: string;
  expiresAt: Date;
}

export class StoredTokenWithOwnerDTO extends StoredTokenDTO {
  owner: MemberProfileDTO;
}
