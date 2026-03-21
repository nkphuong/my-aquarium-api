import { RegisterRequestDTO } from '../dtos/register.request.dto';
import { AuthResponseDTO } from '../dtos/auth.response.dto';
import { RegisterResponseDTO } from '../dtos/register.response.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';

export interface IAccountManager {
  register(
    data: RegisterRequestDTO,
  ): Promise<AuthResponseDTO | RegisterResponseDTO>;
  getCurrentUser(userId: number): Promise<UserProfileResponseDTO>;
}
