import { UserStatus } from '../enums/user-status.enum';

export class UserProfileResponseDTO {
  id: number;
  email: string;
  fullname: string | null;
  status: UserStatus;
}
