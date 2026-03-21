import { Body, Controller, Post, Get, UseGuards, Inject } from '@nestjs/common';

import type { IAccountManager } from '@subsystems/membership/contracts/account.manager.interface';
import type { ISessionManager } from '@subsystems/membership/contracts/session.manager.interface';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

import { RegisterRequestDTO } from '@subsystems/membership/dtos/register.request.dto';
import { LoginRequestDTO } from '@subsystems/membership/dtos/login.request.dto';
import { RefreshTokenRequestDTO } from '@subsystems/membership/dtos/refresh-token.request.dto';
import { LogoutRequestDTO } from '@subsystems/membership/dtos/logout.request.dto';
import { AuthResponseDTO } from '@subsystems/membership/dtos/auth.response.dto';
import { RegisterResponseDTO } from '@subsystems/membership/dtos/register.response.dto';
import { UserProfileResponseDTO } from '@subsystems/membership/dtos/user-profile.response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAccountManager')
    private readonly accountManager: IAccountManager,
    @Inject('ISessionManager')
    private readonly sessionManager: ISessionManager,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDTO,
  ): Promise<AuthResponseDTO | RegisterResponseDTO> {
    return await this.accountManager.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginRequestDTO): Promise<AuthResponseDTO> {
    return await this.sessionManager.authenticateAccount(loginDto);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshDto: RefreshTokenRequestDTO,
  ): Promise<AuthResponseDTO> {
    return await this.sessionManager.refreshToken(refreshDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() logoutDto: LogoutRequestDTO): Promise<void> {
    return await this.sessionManager.logout(logoutDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @CurrentUser() user: { userId: number },
  ): Promise<UserProfileResponseDTO> {
    return await this.accountManager.getCurrentUser(user.userId);
  }
}
