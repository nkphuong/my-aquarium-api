import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';
import { UserStatus } from '../enums/user-status.enum';

export class AdminUpdateUserRequestDTO extends BaseRequest {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(72)
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullname?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
