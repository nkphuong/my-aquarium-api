import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';

export class RegisterRequestDTO extends BaseRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullName?: string;
}
