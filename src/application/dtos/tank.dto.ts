import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TankType } from '../../domain/enums/tank.enum';

export class TankDimensionsDto {
  @IsNumber()
  @Min(1)
  length: number;

  @IsNumber()
  @Min(1)
  width: number;

  @IsNumber()
  @Min(1)
  height: number;
}

// Input DTO for creating tank
export class CreateTankDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ValidateNested()
  @Type(() => TankDimensionsDto)
  @IsOptional()
  dimensions?: TankDimensionsDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  volume_liters?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  tank_type?: string; // Should validate against TankType enum values if strict, but string is flexible

  @IsOptional()
  @IsString()
  @MaxLength(50)
  style?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000) // Increased for rich text
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  setup_date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255) // Text in DB, but URL usually fits in string
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

// Input DTO for updating tank
export class UpdateTankDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TankDimensionsDto)
  dimensions?: TankDimensionsDto;

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

// Output DTO for API responses
export class TankDto {
  id: number; // BigInt handled as number/string in DTO usually? The repository mapped BigInt to Number.
  name: string;
  dimensions?: TankDimensionsDto;
  volumeLiters?: number;
  tankType?: string;
  style?: string;
  description?: string;
  substrate?: string;
  filterType?: string;
  coverImageUrl?: string;
  setupDate?: Date;
  isArchived: boolean;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(tank: any): TankDto {
    const dto = new TankDto();
    dto.id = Number(tank.id); // Ensure number
    dto.name = tank.name;
    dto.dimensions = tank.dimensions;
    dto.volumeLiters = tank.volume_liters;
    dto.tankType = tank.tank_type;
    dto.style = tank.style;
    dto.description = tank.description;
    dto.substrate = tank.substrate;
    dto.filterType = tank.filter_type;
    dto.coverImageUrl = tank.cover_image_url;
    dto.setupDate = tank.setup_date;
    dto.isArchived = tank.is_archived;
    dto.userId = tank.user_id;
    dto.createdAt = tank.created_at;
    dto.updatedAt = tank.updated_at;
    return dto;
  }

  static fromEntities(tanks: any[]): TankDto[] {
    return tanks.map(tank => TankDto.fromEntity(tank));
  }
}
