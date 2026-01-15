import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, AuthResponseDto, UserDto, RefreshTokenDto } from '@application/dtos/auth.dto';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

export const ACCESS_TOKEN_EXPIRES_IN = 5 * 60; // 5minutes
export const REFRESH_TOKEN_EXPIRES_IN = 1 * 30 * 24 * 60 * 60; //30days
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new User(0, dto.email, hashedPassword, dto.name);
    const savedUser = await this.userRepository.save(user);

    const tokens = await this.getTokens(Number(savedUser.id), savedUser.email);
    await this.updateRefreshToken(Number(savedUser.id), tokens.refreshToken);

    return {
      user: UserDto.fromEntity(savedUser),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(Number(user.id), user.email);
    await this.updateRefreshToken(Number(user.id), tokens.refreshToken);

    return {
      user: UserDto.fromEntity(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshTokenHash: null } as any);
  }

  async refreshTokens(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: 'refreshSecretKey', // TODO: Use env
      });
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(Number(user.id), user.email);
    await this.updateRefreshToken(Number(user.id), tokens.refreshToken);

    return {
      user: UserDto.fromEntity(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  async getCurrentUser(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }
    return UserDto.fromEntity(user);
  }

  async validateToken(payload: any): Promise<UserDto> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return UserDto.fromEntity(user);
  }

  private async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: 'secretKey', expiresIn: ACCESS_TOKEN_EXPIRES_IN }, // Access Token: 5 minutes
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: 'refreshSecretKey', expiresIn: REFRESH_TOKEN_EXPIRES_IN }, // Refresh Token: 7 days
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { refreshTokenHash: hash });
  }
}
