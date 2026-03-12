import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { BaseRequest } from '@core/requests/base.request';
import {
  ICreateTankCommand,
  IUpdateTankCommand,
} from '@managers/interfaces/aquarium.manager.interface';

export class CreateTankRequest extends BaseRequest implements ICreateTankCommand {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(1)
  length: number;

  @IsNumber()
  @Min(1)
  width: number;

  @IsNumber()
  @Min(1)
  height: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  volume_liters?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  tank_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  style?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  setup_date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  cover_image_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  substrate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  filter_type?: string;
}

export class UpdateTankRequest extends PartialType(CreateTankRequest) implements IUpdateTankCommand { }
