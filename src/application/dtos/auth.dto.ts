import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

// Output DTO for API responses
export class UserDto {
  id: number;
  email: string;
  fullname?: string;
  createdAt: Date;

  // Factory method to create from domain entity
  static fromEntity(user: any): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.email = user.email;
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
  expiresIn: string | number;
}

export class ValidateTokenDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
