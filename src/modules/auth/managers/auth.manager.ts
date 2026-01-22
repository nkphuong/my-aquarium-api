import { Injectable, Inject, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterRequest, LoginRequest, RefreshTokenRequest } from '../requests/auth.request';
import { User } from '../entities/user.entity';
import { EntityNotFoundException } from '@core/exceptions/domain.exception';
import type { IUserAccessor } from '../accessors/user.accessor.interface';
import { USER_ACCESSOR } from '../accessors/user.accessor.interface';

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

    async register(dto: RegisterRequest): Promise<AuthResult> {
        const existingUser = await this.userAccessor.findByEmail(dto.email);
        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = new User();
        user.fill({
            email: dto.email,
            password: hashedPassword,
            fullname: dto.name,
        } as any);

        const savedUser = await this.userAccessor.save(user);

        const tokens = await this.getTokens(savedUser.id!, savedUser.email!);
        await this.updateRefreshToken(savedUser.id!, tokens.refreshToken);

        return {
            user: savedUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        };
    }

    async login(dto: LoginRequest): Promise<AuthResult> {
        const user = await this.userAccessor.findByEmail(dto.email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.getTokens(user.id!, user.email!);
        await this.updateRefreshToken(user.id!, tokens.refreshToken);

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

    async refreshTokens(dto: RefreshTokenRequest): Promise<AuthResult> {
        let payload: any;
        try {
            payload = this.jwtService.verify(dto.refreshToken, {
                secret: 'refreshSecretKey', // TODO: Use env
            });
        } catch (e) {
            throw new ForbiddenException('Invalid refresh token');
        }

        const user = await this.userAccessor.findById(payload.sub);
        if (!user || !user.refresh_token_hash) {
            throw new ForbiddenException('Access denied');
        }

        const refreshTokenMatches = await bcrypt.compare(dto.refreshToken, user.refresh_token_hash);
        if (!refreshTokenMatches) {
            throw new ForbiddenException('Access denied');
        }

        const tokens = await this.getTokens(user.id!, user.email!);
        await this.updateRefreshToken(user.id!, tokens.refreshToken);

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
            throw new EntityNotFoundException('User', userId);
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

    private async getTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: 'secretKey', expiresIn: ACCESS_TOKEN_EXPIRES_IN },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: 'refreshSecretKey', expiresIn: REFRESH_TOKEN_EXPIRES_IN },
            ),
        ]);

        return { accessToken, refreshToken };
    }

    private async updateRefreshToken(userId: number, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.userAccessor.updateRefreshToken(userId, hash);
    }
}
