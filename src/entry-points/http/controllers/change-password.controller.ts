import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import type { IAccountManager } from '@subsystems/membership/contracts/account.manager.interface';
import { ForgotPasswordRequestDTO } from '@subsystems/membership/dtos/forgot-password.request.dto';
import { ResetPasswordRequestDTO } from '@subsystems/membership/dtos/reset-password.request.dto';

@Controller('auth')
export class ChangePasswordController {
  constructor(
    @Inject('IAccountManager')
    private readonly accountManager: IAccountManager,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordRequestDTO,
  ): Promise<{ message: string }> {
    return this.accountManager.forgotPassword(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordRequestDTO,
  ): Promise<{ message: string }> {
    return this.accountManager.resetPassword(body.token, body.newPassword);
  }
}
