import { Injectable } from '@nestjs/common';
import { UseCase } from '@application/use-cases/base.use-case';
import { LoginDto, AuthResponseDto, UserDto } from '@application/dtos/auth.dto';
import { SupabaseAuthService } from '@infrastructure/auth/supabase-auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { Email } from '@domain/value-objects/email.value-object';

@Injectable()
export class LoginUseCase implements UseCase<LoginDto, AuthResponseDto> {
  constructor(
    private readonly authService: SupabaseAuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: LoginDto): Promise<AuthResponseDto> {
    // Validate email
    const email = Email.create(input.email);

    // Authenticate with Supabase
    const authResult = await this.authService.signIn(
      email.value,
      input.password,
    );
    // Find or create local user
    let user = await this.userRepository.findByAuthId(
      authResult.user.id,
    );

    if (!user) {
      // Sync user from Supabase Auth to local DB
      user = new User(
        0,
        authResult.user.id,
        authResult.user.user_metadata?.fullname,
      );
      user = await this.userRepository.save(user);
    }

    return {
      user: this.mapToUserDto(user),
      accessToken: authResult.session.accessToken,
      refreshToken: authResult.session.refreshToken,
      expiresIn: authResult.session.expiresIn,
    };
  }

  private mapToUserDto(user: User): UserDto {
    return {
      id: user.id,
      authId: user.authId,
      fullname: user.fullname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
