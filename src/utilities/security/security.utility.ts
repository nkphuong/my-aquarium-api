import { Injectable } from '@nestjs/common';
import type { ISecurityUtility } from './security.utility.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import type { StringValue } from 'ms';

@Injectable()
export class SecurityUtility implements ISecurityUtility {
  constructor(private readonly jwtService: JwtService) {}

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

  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
