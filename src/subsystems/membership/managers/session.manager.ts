import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { ISessionManager } from '../contracts/session.manager.interface';
import type { IMemberAccess } from '../contracts/member.access.interface';
import type { IUserTokenAccess } from '../contracts/user-token.access.interface';
import type { ISecurityUtility } from '@utilities/security/security.utility.interface';
import { LoginRequestDTO } from '../dtos/login.request.dto';
import { AuthResponseDTO } from '../dtos/auth.response.dto';
import { RefreshTokenRequestDTO } from '../dtos/refresh-token.request.dto';

@Injectable()
export class SessionManager implements ISessionManager {
  constructor(
    @Inject('IMemberAccess') private memberAccess: IMemberAccess,
    @Inject('IUserTokenAccess') private userTokenAccess: IUserTokenAccess,
    @Inject('ISecurityUtility') private securityUtil: ISecurityUtility,
  ) {}

  public async authenticateAccount(
    data: LoginRequestDTO,
  ): Promise<AuthResponseDTO> {
    const credentials = await this.memberAccess.getMemberByCredentials(
      data.email,
    );

    if (!credentials) {
      throw new UnauthorizedException('Authentication failed.');
    }

    const isValid = await this.securityUtil.verifyPassword(
      data.password,
      credentials.hashedPassword,
    );

    if (!isValid) {
      throw new UnauthorizedException('Authentication failed.');
    }

    const accessToken = this.securityUtil.generateToken(credentials.id);
    const refreshToken = this.securityUtil.generateRefreshToken();
    const refreshTokenHash = this.securityUtil.hashToken(refreshToken);
    const expiresAt = this.securityUtil.getRefreshTokenExpirationDate();

    await this.userTokenAccess.addToken(
      credentials.id,
      'user',
      refreshTokenHash,
      expiresAt,
    );

    const response = new AuthResponseDTO();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.expireAt = expiresAt;
    response.member = {
      id: credentials.id,
      email: credentials.email,
      fullname: credentials.fullname,
    };
    return response;
  }

  public async refreshToken(
    data: RefreshTokenRequestDTO,
  ): Promise<AuthResponseDTO> {
    const tokenHash = this.securityUtil.hashToken(data.refreshToken);
    const storedToken =
      await this.userTokenAccess.findByHashWithOwner(tokenHash);

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    await this.userTokenAccess.revokeToken(storedToken.id);

    const member = storedToken.owner;
    const accessToken = this.securityUtil.generateToken(member.id);
    const newRefreshToken = this.securityUtil.generateRefreshToken();
    const newHash = this.securityUtil.hashToken(newRefreshToken);
    const expiresAt = this.securityUtil.getRefreshTokenExpirationDate();

    await this.userTokenAccess.addToken(
      member.id,
      storedToken.tokenableType,
      newHash,
      expiresAt,
    );

    const response = new AuthResponseDTO();
    response.accessToken = accessToken;
    response.refreshToken = newRefreshToken;
    response.expireAt = expiresAt;
    response.member = member;
    return response;
  }

  public async validateToken(
    payload: Record<string, unknown>,
    _strategyName?: string,
  ): Promise<Record<string, unknown>> {
    const sub = payload?.sub;
    if (!sub) {
      throw new UnauthorizedException('Invalid token payload.');
    }
    const member = await this.memberAccess.getMemberById(sub as number);
    if (!member) {
      throw new UnauthorizedException('User not found.');
    }
    return { userId: sub, ...payload };
  }

  public async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.securityUtil.hashToken(refreshToken);
    const storedToken = await this.userTokenAccess.findByHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    await this.userTokenAccess.revokeByHash(tokenHash);
  }
}
