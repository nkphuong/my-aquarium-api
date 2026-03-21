import { MemberProfileDTO } from './member-profile.dto';

export class AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  tokenType: string = 'Bearer';
  expireAt: Date;
  member: MemberProfileDTO;
}
