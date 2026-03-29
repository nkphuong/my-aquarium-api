import { RegisterRequestDTO } from '../dtos/register.request.dto';
import { AuthResponseDTO } from '../dtos/auth.response.dto';
import { RegisterResponseDTO } from '../dtos/register.response.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import { AdminUserProfileResponseDTO } from '../dtos/admin-user-profile.response.dto';
import { AdminCreateUserRequestDTO } from '../dtos/admin-create-user.request.dto';
import { AdminUpdateUserRequestDTO } from '../dtos/admin-update-user.request.dto';
import { ListUsersQueryDTO } from '../dtos/list-users-query.dto';
import { PaginatedResult } from '@core/types/pagination';

export interface IAccountManager {
  register(
    data: RegisterRequestDTO,
  ): Promise<AuthResponseDTO | RegisterResponseDTO>;
  getCurrentUser(
    userId: number,
    type?: string,
  ): Promise<UserProfileResponseDTO>;

  // Admin user management
  listUsers(
    query: ListUsersQueryDTO,
  ): Promise<PaginatedResult<AdminUserProfileResponseDTO>>;
  getUser(id: number): Promise<AdminUserProfileResponseDTO>;
  createUser(
    data: AdminCreateUserRequestDTO,
  ): Promise<AdminUserProfileResponseDTO>;
  updateUser(
    id: number,
    data: AdminUpdateUserRequestDTO,
  ): Promise<AdminUserProfileResponseDTO>;
  deleteUser(id: number): Promise<void>;

  // Email verification
  verifyEmail(token: string): Promise<{ message: string }>;
  resendVerificationEmail(
    email: string,
    previousToken: string,
  ): Promise<{ message: string }>;

  // Password reset
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }>;
}
