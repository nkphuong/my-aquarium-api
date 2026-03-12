import {
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';
import { ICreateWaterParameterCommand } from '@managers/interfaces/water-lab.manager.interface';

export class CreateWaterParameterRequest extends BaseRequest implements ICreateWaterParameterCommand {
  @IsNumber()
  @IsNotEmpty()
  tankId: number;

  @IsDateString()
  @IsOptional()
  testedAt?: Date;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  ph?: number;

  @IsNumber()
  @IsOptional()
  ammonia?: number;

  @IsNumber()
  @IsOptional()
  nitrite?: number;

  @IsNumber()
  @IsOptional()
  nitrate?: number;

  @IsNumber()
  @IsOptional()
  gh?: number;

  @IsNumber()
  @IsOptional()
  kh?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
