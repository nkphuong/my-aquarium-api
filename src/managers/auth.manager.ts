import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  IRegisterCommand,
  ILoginCommand,
  IRefreshTokenCommand,
} from './interfaces/auth.manager.interface';
import { User } from '@entities/user.entity';
import {
  UnauthorizedException,
  ForbiddenException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../exceptions';
import type { IUserAccessor } from '@accessors/user/interfaces/user.accessor.interface';
import { USER_ACCESSOR } from '@accessors/user/interfaces/user.accessor.interface';

export const ACCESS_TOKEN_EXPIRES_IN = 5 * 60; // 5 minutes
export const REFRESH_TOKEN_EXPIRES_IN = 1 * 30 * 24 * 60 * 60; // 30 days

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthManager {
  constructor(
    @Inject(USER_ACCESSOR) private readonly userAccessor: IUserAccessor,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: IRegisterCommand): Promise<AuthResult> {
    const existingUser = await this.userAccessor.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(dto.email);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User();
    user.fill({
      email: dto.email,
      password: hashedPassword,
      fullname: dto.name,
    } as User);

    const savedUser = await this.userAccessor.save(user);

    const tokens = await this.generateAuthTokens(user.id, user.email,
      process.env.AUTH_SECRET || 'accessToken',
      process.env.AUTH_REFRESH_SECRET || 'refreshToken',
      ACCESS_TOKEN_EXPIRES_IN,
      REFRESH_TOKEN_EXPIRES_IN
    );


    await this.updateRefreshToken(savedUser.id, tokens.refreshToken);

    return {
      user: savedUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  async login(dto: ILoginCommand): Promise<AuthResult> {
    const user = await this.userAccessor.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }


    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateAuthTokens(user.id, user.email,
      process.env.AUTH_SECRET || 'accessToken',
      process.env.AUTH_REFRESH_SECRET || 'refreshToken',
      ACCESS_TOKEN_EXPIRES_IN,
      REFRESH_TOKEN_EXPIRES_IN
    );

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  async logout(userId: number) {
    await this.userAccessor.updateRefreshToken(userId, null);
  }

  async refreshTokens(dto: IRefreshTokenCommand): Promise<AuthResult> {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.AUTH_REFRESH_SECRET || 'refreshToken',
      });
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const user = await this.userAccessor.findById(payload.sub);
    if (!user || !user.refresh_token_hash) {
      throw new ForbiddenException('Access denied');
    }

    const tokenHashStr = crypto.createHash('sha256').update(dto.refreshToken).digest('hex');
    const isMatch = await bcrypt.compare(tokenHashStr, user.refresh_token_hash);
    if (!isMatch) {
      throw new ForbiddenException('Access denied');
    }

    // Generate NEW access and refresh tokens (Refresh Token Rotation)
    const tokens = await this.generateAuthTokens(user.id, user.email,
      process.env.AUTH_SECRET || 'accessToken',
      process.env.AUTH_REFRESH_SECRET || 'refreshToken',
      ACCESS_TOKEN_EXPIRES_IN,
      REFRESH_TOKEN_EXPIRES_IN
    );

    // Save the new refresh token hash to the DB, invalidating the old one
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  async getCurrentUser(userId: number): Promise<User> {
    const user = await this.userAccessor.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return user;
  }

  async validateToken(payload: any): Promise<User> {
    const user = await this.userAccessor.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }



  private async updateRefreshToken(userId: number, refreshToken: string) {
    const tokenHashStr = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const hash = await bcrypt.hash(tokenHashStr, 10);
    await this.userAccessor.updateRefreshToken(userId, hash);
  }

  private async generateAuthTokens(
    userId: number,
    email: string,
    secretKey: string,
    refreshTokenSecretKey: string,
    accessTokenExpIn: number,
    refreshTokenExpIn: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: secretKey, expiresIn: accessTokenExpIn },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: refreshTokenSecretKey, expiresIn: refreshTokenExpIn },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
