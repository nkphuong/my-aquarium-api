import {
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';

export class SetupTankRequest extends BaseRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  ideas: string;
}
