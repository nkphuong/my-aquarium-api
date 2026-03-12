import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';
import {
  ILoginCommand,
  IRegisterCommand,
  IRefreshTokenCommand,
} from '@managers/interfaces/auth.manager.interface';

export class LoginRequest extends BaseRequest implements ILoginCommand {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterRequest extends BaseRequest implements IRegisterCommand {
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

export class RefreshTokenRequest extends BaseRequest implements IRefreshTokenCommand {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
