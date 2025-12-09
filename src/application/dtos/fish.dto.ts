import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';

// Output DTO for API responses (like Laravel API Resource)
export class FishDto {
  id: number;
  name: string;
  species: string;
  tankId?: number;
  createdAt: Date;
  updatedAt: Date;

  // Factory method to create from domain entity
  static fromEntity(fish: any): FishDto {
    const dto = new FishDto();
    dto.id = fish.id;
    dto.name = fish.name;
    dto.species = fish.species;
    dto.tankId = fish.tankId;
    dto.createdAt = fish.created_at;
    dto.updatedAt = fish.updated_at;
    return dto;
  }

  // Collection method
  static fromEntities(fishes: any[]): FishDto[] {
    return fishes.map(fish => FishDto.fromEntity(fish));
  }
}

export class CreateFishDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  species: string;
}

export class UpdateFishDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  species?: string;
}
