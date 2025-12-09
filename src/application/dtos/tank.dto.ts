import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

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
}

// Output DTO for API responses (like Laravel API Resource)
// This transforms domain entities to clean API responses
export class TankDto {
  id: number;
  name: string;
  width: number;
  height: number;
  length: number;
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
