import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsStrongPassword,
} from 'class-validator';
import { Match } from '@utilities/validator/match.validator';

export class ResetPasswordRequestDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  newPassword: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  @Match('newPassword')
  newConfirmPassword: string;
}
