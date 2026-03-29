import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendVerificationRequestDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  previousToken: string;
}
