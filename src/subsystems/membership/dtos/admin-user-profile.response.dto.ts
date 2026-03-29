import { UserProfileResponseDTO } from './user-profile.response.dto';

export class AdminUserProfileResponseDTO extends UserProfileResponseDTO {
  verifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
