import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IAuthConfigUtility } from './auth-config.utility.interface';

@Injectable()
export class AuthConfigUtility implements IAuthConfigUtility {
  constructor(private readonly configService: ConfigService) {}

  private resolveProvider(type?: string): string {
    const guardType =
      type ?? this.configService.get<string>('auth.defaults.guard');
    if (!guardType) {
      throw new Error('JWT type not found');
    }

    const provider = this.configService.get<string>(
      `auth.guards.${guardType}.provider`,
    );
    if (!provider) {
      throw new Error(`JWT provider for type ${guardType} not found`);
    }

    return provider;
  }

  public getSecret(type?: string): string {
    const provider = this.resolveProvider(type);
    const secret = this.configService.get<string>(
      `auth.providers.${provider}.secret`,
    );
    if (!secret) {
      throw new Error(
        `JWT secret for type ${type ?? 'default'} not found`,
      );
    }
    return secret;
  }

  public getAccessTokenExpiration(type?: string): string {
    const provider = this.resolveProvider(type);
    return (
      this.configService.get<string>(
        `auth.providers.${provider}.expireIn`,
      ) || '15m'
    );
  }

  public getRefreshTokenExpiration(type?: string): string {
    const provider = this.resolveProvider(type);
    return (
      this.configService.get<string>(
        `auth.providers.${provider}.refreshToken.expireIn`,
      ) || '7d'
    );
  }

  public getRefreshTokenExpirationDate(type?: string): Date {
    const expireIn = this.getRefreshTokenExpiration(type);
    const match = expireIn.match(/^(\d+)([dhms])$/);
    if (!match) {
      throw new Error(
        `Invalid refresh token expiration format: ${expireIn}`,
      );
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
