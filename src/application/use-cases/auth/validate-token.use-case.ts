import { Injectable } from '@nestjs/common';
import { UseCase } from '@application/use-cases/base.use-case';
import { ValidateTokenDto, UserDto } from '@application/dtos/auth.dto';
import { SupabaseAuthService } from '@infrastructure/auth/supabase-auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { UnauthorizedException } from '@domain/exceptions/auth.exception';

@Injectable()
export class ValidateTokenUseCase
  implements UseCase<ValidateTokenDto, UserDto>
{
  constructor(
    private readonly authService: SupabaseAuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ValidateTokenDto): Promise<UserDto> {
    // Verify token with Supabase
    const supabaseUser = await this.authService.verifyToken(
      input.accessToken,
    );

    // Get local user
    const user = await this.userRepository.findByAuthId(
      supabaseUser.id,
    );

    if (!user) {
      throw new UnauthorizedException('User not found in local database');
    }

    return {
      id: user.id,
      authId: user.authId,
      fullname: user.fullname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
