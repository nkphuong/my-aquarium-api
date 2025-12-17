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

// Input DTO for creating tank (like Laravel FormRequest)
export class CreateTankDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(1, { message: 'Width must be at least 1 cm' })
  width: number;

  @IsNumber()
  @Min(1, { message: 'Height must be at least 1 cm' })
  height: number;

  @IsNumber()
  @Min(1, { message: 'Length must be at least 1 cm' })
  length: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  style?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  setup_at?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  water_volume?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;
}

// Input DTO for updating tank (like Laravel FormRequest)
// Uses Partial to make all fields optional - DRY!
export class UpdateTankDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Width must be at least 1 cm' })
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Height must be at least 1 cm' })
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Length must be at least 1 cm' })
  length?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  style?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  setup_at?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  water_volume?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;
}

// Output DTO for API responses (like Laravel API Resource)
// This transforms domain entities to clean API responses
export class TankDto {
  id: number;
  name: string;
  width: number;
  height: number;
  length: number;
  type?: string;
  style?: string;
  description?: string;
  status?: string;
  setup_at?: Date;
  water_volume?: number;
  avatar?: string;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;

  // Factory method to create from domain entity (like Laravel's Resource)
  static fromEntity(tank: any): TankDto {
    const dto = new TankDto();
    dto.id = tank.id;
    dto.name = tank.name;
    dto.width = tank.width;
    dto.height = tank.height;
    dto.length = tank.length;
    dto.type = tank.type;
    dto.style = tank.style;
    dto.description = tank.description;
    dto.status = tank.status;
    dto.setup_at = tank.setup_at;
    dto.water_volume = tank.water_volume;
    dto.avatar = tank.avatar;
    dto.userId = tank.user_id;
    dto.createdAt = tank.created_at;
    dto.updatedAt = tank.updated_at;
    return dto;
  }

  // Collection method (like Laravel's ResourceCollection)
  static fromEntities(tanks: any[]): TankDto[] {
    return tanks.map(tank => TankDto.fromEntity(tank));
  }
}
