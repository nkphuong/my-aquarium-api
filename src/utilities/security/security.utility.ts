import { Injectable, Inject } from '@nestjs/common';
import type {
  ISecurityUtility,
  AuthTokenPair,
  HashedToken,
} from './security.utility.interface';
import type { IAuthConfigUtility } from '../auth-config/auth-config.utility.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import type { StringValue } from 'ms';

@Injectable()
export class SecurityUtility implements ISecurityUtility {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IAuthConfigUtility')
    private readonly authConfigUtil: IAuthConfigUtility,
  ) {}

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  public signJwt(
    payload: Record<string, unknown>,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn as StringValue,
    });
  }

  public generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  public generateToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public generateAuthTokenPair(
    type: string,
    payload: Record<string, unknown>,
  ): AuthTokenPair {
    const secret = this.authConfigUtil.getSecret(type);
    const expiresIn = this.authConfigUtil.getAccessTokenExpiration(type);

    const accessToken = this.signJwt(payload, secret, expiresIn);

    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(refreshToken);

    const accessTokenExpiresAt =
      this.authConfigUtil.getAccessTokenExpirationDate(type);
    const refreshTokenExpiresAt =
      this.authConfigUtil.getRefreshTokenExpirationDate(type);

    return {
      accessToken,
      refreshToken,
      refreshTokenHash,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  public generateTimedToken(expireInHours: number): HashedToken {
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + expireInHours * 60 * 60 * 1000);

    return { token, tokenHash, expiresAt };
  }
}
