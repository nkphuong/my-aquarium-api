import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ResponseDto } from '@core/dto/response.dto';
import { AuthManager } from '../managers/auth.manager';
import { RegisterRequest, LoginRequest, RefreshTokenRequest } from '../requests/auth.request';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { UserResource } from '../resources/user.resource';

@Controller('auth')
export class AuthController {
    constructor(private readonly authManager: AuthManager) { }

    @Post('register')
    async register(@Body() registerDto: RegisterRequest) {
        try {
            const result = await this.authManager.register(registerDto);
            return ResponseDto.success({
                user: new UserResource(result.user),
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                expiresIn: result.expiresIn,
            }, 'Registration successful');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginRequest) {
        try {
            const result = await this.authManager.login(loginDto);
            return ResponseDto.success({
                user: new UserResource(result.user),
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                expiresIn: result.expiresIn,
            }, 'Login successful');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Post('refresh')
    async refreshTokens(@Body() refreshDto: RefreshTokenRequest) {
        try {
            const result = await this.authManager.refreshTokens(refreshDto);
            return ResponseDto.success({
                user: new UserResource(result.user),
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                expiresIn: result.expiresIn,
            });
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@CurrentUser() user: User) {
        try {
            await this.authManager.logout(user.id!);
            return ResponseDto.success(null, 'Logout successful');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() user: User) {
        try {
            const currentUser = await this.authManager.getCurrentUser(user.id!);
            return ResponseDto.success(new UserResource(currentUser));
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }
}
