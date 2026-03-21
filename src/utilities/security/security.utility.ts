import { Injectable } from '@nestjs/common';
import type { ISecurityUtility } from '@utilities/security/security.utility.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Injectable()
export class SecurityUtility implements ISecurityUtility {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
  public generateToken(memberId: number): string {
    const accessToken = this.jwtService.sign(
      { sub: memberId },
      {
        secret: this.configService.get<string>('jwt.accessToken.secret'),
        expiresIn: this.getAccessTokenExpiration() as StringValue,
      },
    );
    return accessToken;
  }

  public generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public getAccessTokenExpiration(): string {
    return this.configService.get<string>('jwt.accessToken.expireIn');
  }
  public getRefreshTokenExpiration(): string {
    return this.configService.get<string>('jwt.refreshToken.expireIn');
  }

  public getRefreshTokenExpirationDate(): Date {
    const expireIn = this.getRefreshTokenExpiration();
    const match = expireIn.match(/^(\d+)([dhms])$/);
    if (!match) {
      throw new Error(`Invalid refresh token expiration format: ${expireIn}`);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const now = new Date();
    switch (unit) {
      case 'd':
        now.setDate(now.getDate() + value);
        break;
      case 'h':
        now.setHours(now.getHours() + value);
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + value);
        break;
      case 's':
        now.setSeconds(now.getSeconds() + value);
        break;
    }
    return now;
  }
}
