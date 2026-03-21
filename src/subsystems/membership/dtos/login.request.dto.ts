import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';

export class LoginRequestDTO extends BaseRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  @MinLength(6)
  password: string;
}
