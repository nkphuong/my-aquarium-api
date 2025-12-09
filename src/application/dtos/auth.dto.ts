import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

// Output DTO for API responses (like Laravel API Resource)
export class UserDto {
  id: number;
  authId: string;
  fullname?: string;
  createdAt: Date;

  // Factory method to create from domain entity
  static fromEntity(user: any): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.authId = user.auth_id;
    dto.fullname = user.fullname;
    dto.createdAt = user.created_at;
    return dto;
  }
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class AuthResponseDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class ValidateTokenDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
