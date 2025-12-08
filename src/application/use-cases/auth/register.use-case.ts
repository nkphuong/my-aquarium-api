import { Injectable } from '@nestjs/common';
import { UseCase } from '@application/use-cases/base.use-case';
import { RegisterDto, AuthResponseDto, UserDto } from '@application/dtos/auth.dto';
import { SupabaseAuthService } from '@infrastructure/auth/supabase-auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { Email } from '@domain/value-objects/email.value-object';
import { UserAlreadyExistsException } from '@domain/exceptions/auth.exception';
import { randomUUID } from 'crypto';

@Injectable()
export class RegisterUseCase
  implements UseCase<RegisterDto, AuthResponseDto>
{
  constructor(
    private readonly authService: SupabaseAuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: RegisterDto): Promise<AuthResponseDto> {
    // Validate email
    const email = Email.create(input.email);



    // Create user in Supabase Auth
    const authResult = await this.authService.signUp(
      email.value,
      input.password,
    );

    // Create local user entity
    const user = new User(
      0,
      authResult.user.id
    );

    // Save to local database
    const savedUser = await this.userRepository.save(user);

    // Map to DTO
    return {
      user: this.mapToUserDto(savedUser),
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
