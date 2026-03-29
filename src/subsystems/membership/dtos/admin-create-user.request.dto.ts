import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';
import { UserStatus } from '../enums/user-status.enum';

export class AdminCreateUserRequestDTO extends BaseRequest {
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
  fullname?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
