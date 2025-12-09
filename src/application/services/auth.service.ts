import { Injectable } from '@nestjs/common';
import { RegisterDto, LoginDto, AuthResponseDto, UserDto } from '@application/dtos/auth.dto';
import { SupabaseAuthService } from '@infrastructure/auth/supabase-auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { User } from '@domain/entities/user.entity';
import { UnauthorizedException } from '@domain/exceptions/auth.exception';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseAuth: SupabaseAuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Create user in Supabase Auth
    const authResult = await this.supabaseAuth.signUp(
      dto.email.toLowerCase().trim(),
      dto.password,
    );

    // Create local user entity
    const user = new User(0, authResult.user.id);

    // Save to local database
    const savedUser = await this.userRepository.save(user);

    return {
      user: UserDto.fromEntity(savedUser),
      accessToken: authResult.session.accessToken,
      refreshToken: authResult.session.refreshToken,
      expiresIn: authResult.session.expiresIn,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // Authenticate with Supabase
    const authResult = await this.supabaseAuth.signIn(
      dto.email.toLowerCase().trim(),
      dto.password,
    );

    // Find or create local user
    let user = await this.userRepository.findByAuthId(authResult.user.id);

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
      user: UserDto.fromEntity(user),
      accessToken: authResult.session.accessToken,
      refreshToken: authResult.session.refreshToken,
      expiresIn: authResult.session.expiresIn,
    };
  }

  async getCurrentUser(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    return UserDto.fromEntity(user);
  }

  async validateToken(accessToken: string): Promise<UserDto> {
    // Verify token with Supabase
    const supabaseUser = await this.supabaseAuth.verifyToken(accessToken);

    // Get local user
    const user = await this.userRepository.findByAuthId(supabaseUser.id);

    if (!user) {
      throw new UnauthorizedException('User not found in local database');
    }

    return UserDto.fromEntity(user);
  }
}
