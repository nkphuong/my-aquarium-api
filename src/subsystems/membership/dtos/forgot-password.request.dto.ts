import { IsEmail } from 'class-validator';

export class ForgotPasswordRequestDTO {
  @IsEmail()
  email: string;
}
