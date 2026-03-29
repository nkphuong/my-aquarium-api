import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import type { IAccountManager } from '@subsystems/membership/contracts/account.manager.interface';
import { ResendVerificationRequestDTO } from '@subsystems/membership/dtos/resend-verification.request.dto';

@Controller('auth')
export class VerifyAccountController {
  constructor(
    @Inject('IAccountManager')
    private readonly accountManager: IAccountManager,
  ) {}

  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    return this.accountManager.verifyEmail(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  async resendVerification(
    @Body() body: ResendVerificationRequestDTO,
  ): Promise<{ message: string }> {
    return this.accountManager.resendVerificationEmail(
      body.email,
      body.previousToken,
    );
  }
}
