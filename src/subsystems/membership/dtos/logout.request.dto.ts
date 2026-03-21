import { IsString, IsNotEmpty } from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';

export class LogoutRequestDTO extends BaseRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
