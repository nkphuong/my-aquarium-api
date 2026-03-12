import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { BaseRequest } from '@core/requests/base.request';
import { ICreateFishSpeciesCommand } from '@managers/interfaces/inventory.manager.interface';

export class FishSpeciesCreateRequest extends BaseRequest implements ICreateFishSpeciesCommand {
  @IsString()
  @IsOptional()
  name_en?: string;

  @IsString()
  @IsNotEmpty()
  name_vn!: string;

  @IsString()
  @IsOptional()
  scientific_name?: string;

  @IsArray()
  @IsOptional()
  aliases?: string[] = [];

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsNumber()
  @IsOptional()
  temp_min?: number;

  @IsNumber()
  @IsOptional()
  temp_max?: number;

  @IsNumber()
  @IsOptional()
  ph_min?: number;

  @IsNumber()
  @IsOptional()
  ph_max?: number;

  @IsInt()
  @IsOptional()
  gh_min?: number;

  @IsInt()
  @IsOptional()
  gh_max?: number;

  @IsInt()
  @IsOptional()
  min_tank_size?: number;

  @IsInt()
  @IsOptional()
  size_max?: number;

  @IsInt()
  @IsOptional()
  bioload_level?: number;

  @IsString()
  @IsOptional()
  flow_preference?: string;

  @IsString()
  @IsOptional()
  care_level?: string;

  @IsString()
  @IsOptional()
  temperament?: string;

  @IsString()
  @IsOptional()
  diet_type?: string;

  @IsBoolean()
  @IsOptional()
  is_schooling?: boolean;

  @IsNumber()
  @IsOptional()
  min_school_size?: number;

  @IsBoolean()
  @IsOptional()
  plant_safe?: boolean;

  @IsBoolean()
  @IsOptional()
  substrate_digger?: boolean;

  @IsBoolean()
  @IsOptional()
  jumper?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
