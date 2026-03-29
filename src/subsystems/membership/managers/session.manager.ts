import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import type { ISessionManager } from '../contracts/session.manager.interface';
import type { IAuthAccess } from '../contracts/auth.access.interface';
import type { IUserTokenAccess } from '../contracts/user-token.access.interface';
import type { ISecurityUtility } from '@utilities/security/security.utility.interface';
import type { IAuthConfigUtility } from '@utilities/auth-config/auth-config.utility.interface';
import { LoginRequestDTO } from '../dtos/login.request.dto';
import { AuthResponseDTO } from '../dtos/auth.response.dto';
import { RefreshTokenRequestDTO } from '../dtos/refresh-token.request.dto';

@Injectable()
export class SessionManager implements ISessionManager {
  constructor(
    @Inject('AUTH_ACCESSORS') private authAccessors: Map<string, IAuthAccess>,
    @Inject('IUserTokenAccess') private userTokenAccess: IUserTokenAccess,
    @Inject('ISecurityUtility') private securityUtil: ISecurityUtility,
    @Inject('IAuthConfigUtility') private authConfigUtil: IAuthConfigUtility,
  ) {}

  public async authenticateAccount(
    data: LoginRequestDTO,
    type: string = 'user',
  ): Promise<AuthResponseDTO> {
    const accessor = this.authAccessors.get(type);

    if (!accessor) {
      throw new UnauthorizedException('Authentication failed.');
    }

    const result = await accessor.getByCredentials(data.email);

    if (!result) {
      throw new UnauthorizedException('Authentication failed.');
    }

    const isValid = await this.securityUtil.verifyPassword(
      data.password,
      result.credentials.hashedPassword,
    );

    if (!isValid) {
      throw new UnauthorizedException('Authentication failed.');
    }

    const secret = this.authConfigUtil.getSecret(type);
    const expiresIn = this.authConfigUtil.getAccessTokenExpiration(type);
    const accessToken = this.securityUtil.signJwt(
      { sub: result.credentials.id },
      secret,
      expiresIn,
    );
    const refreshToken = this.securityUtil.generateRefreshToken();
    const refreshTokenHash = this.securityUtil.hashToken(refreshToken);
    const expiresAt = this.authConfigUtil.getRefreshTokenExpirationDate(type);

    await this.userTokenAccess.addToken(
      result.entity,
      result.tokenableType,
      refreshTokenHash,
      expiresAt,
    );

    const response = new AuthResponseDTO();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.expireAt = expiresAt;
    response.member = {
      id: result.credentials.id,
      email: result.credentials.email,
      fullname: result.credentials.fullname,
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

    const tokenType = storedToken.tokenableType;
    const member = storedToken.owner;

    const secret = this.authConfigUtil.getSecret(tokenType);
    const expiresIn = this.authConfigUtil.getAccessTokenExpiration(tokenType);
    const accessToken = this.securityUtil.signJwt(
      { sub: member.id },
      secret,
      expiresIn,
    );
    const newRefreshToken = this.securityUtil.generateRefreshToken();
    const newHash = this.securityUtil.hashToken(newRefreshToken);
    const expiresAt =
      this.authConfigUtil.getRefreshTokenExpirationDate(tokenType);

    const accessor = this.authAccessors.get(tokenType);
    if (!accessor) {
      throw new UnauthorizedException('Invalid token type.');
    }

    const entityResult = await accessor.getByCredentials(member.email);
    if (!entityResult) {
      throw new UnauthorizedException('Account not found.');
    }

    await this.userTokenAccess.addToken(
      entityResult.entity,
      tokenType,
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
    strategyName: string = 'user',
  ): Promise<Record<string, unknown>> {
    const sub = payload?.sub;
    if (!sub) {
      throw new UnauthorizedException('Invalid token payload.');
    }

    const accessor = this.authAccessors.get(strategyName);
    if (!accessor) {
      throw new UnauthorizedException('Invalid token type.');
    }

    const member = await accessor.getById(sub as number);
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
