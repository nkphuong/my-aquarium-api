import { BaseDto } from './base.dto';

export class UserDto extends BaseDto {
  authId: string;
  fullname?: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export class AuthResponseDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class ValidateTokenDto {
  accessToken: string;
}
