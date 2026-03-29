import { LoginRequestDTO } from '../dtos/login.request.dto';
import { RefreshTokenRequestDTO } from '../dtos/refresh-token.request.dto';
import { AuthResponseDTO } from '../dtos/auth.response.dto';

export interface ISessionManager {
  authenticateAccount(
    data: LoginRequestDTO,
    type?: string,
  ): Promise<AuthResponseDTO>;
  refreshToken(data: RefreshTokenRequestDTO): Promise<AuthResponseDTO>;
  logout(refreshToken: string): Promise<void>;
  validateToken(
    payload: Record<string, unknown>,
    strategyName?: string,
  ): Promise<Record<string, unknown>>;
}
