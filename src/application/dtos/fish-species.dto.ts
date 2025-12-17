import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { FishSpecies } from '@domain/entities/fish-species.entity';
import {
  CareLevel,
  Temperament,
  DietType,
  FlowPreference,
} from '@domain/enums/fish-species.enum';

// Output DTO (API response)
export class FishSpeciesDto {
  id: number;
  nameEn: string;
  nameVn: string;
  scientificName?: string;
  aliases: string[];
  imageUrl?: string;
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
  ghMin?: number;
  ghMax?: number;
  minTankSize: number;
  sizeMax: number;
  bioloadLevel: number;
  flowPreference: FlowPreference;
  careLevel: CareLevel;
  temperament: Temperament;
  dietType: DietType;
  isSchooling: boolean;
  minSchoolSize: number;
  plantSafe: boolean;
  substrateDigger: boolean;
  jumper: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(fishSpecies: FishSpecies): FishSpeciesDto {
    const dto = new FishSpeciesDto();
    dto.id = fishSpecies.id;
    dto.nameEn = fishSpecies.nameEn;
    dto.nameVn = fishSpecies.nameVn;
    dto.scientificName = fishSpecies.scientificName;
    dto.aliases = fishSpecies.aliases;
    dto.imageUrl = fishSpecies.imageUrl;
    dto.tempMin = fishSpecies.tempMin;
    dto.tempMax = fishSpecies.tempMax;
    dto.phMin = fishSpecies.phMin;
    dto.phMax = fishSpecies.phMax;
    dto.ghMin = fishSpecies.ghMin;
    dto.ghMax = fishSpecies.ghMax;
    dto.minTankSize = fishSpecies.minTankSize;
    dto.sizeMax = fishSpecies.sizeMax;
    dto.bioloadLevel = fishSpecies.bioloadLevel;
    dto.flowPreference = fishSpecies.flowPreference;
    dto.careLevel = fishSpecies.careLevel;
    dto.temperament = fishSpecies.temperament;
    dto.dietType = fishSpecies.dietType;
    dto.isSchooling = fishSpecies.isSchooling;
    dto.minSchoolSize = fishSpecies.minSchoolSize;
    dto.plantSafe = fishSpecies.plantSafe;
    dto.substrateDigger = fishSpecies.substrateDigger;
    dto.jumper = fishSpecies.jumper;
    dto.description = fishSpecies.description;
    dto.createdAt = fishSpecies.created_at;
    dto.updatedAt = fishSpecies.updated_at;
    return dto;
  }

  static fromEntities(fishSpecies: FishSpecies[]): FishSpeciesDto[] {
    return fishSpecies.map((fs) => FishSpeciesDto.fromEntity(fs));
  }
}

// Input DTO for creating fish species
export class CreateFishSpeciesDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  nameVn: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  scientificName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aliases?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  @Max(50)
  tempMin: number;

  @IsNumber()
  @Min(0)
  @Max(50)
  tempMax: number;

  @IsNumber()
  @Min(0)
  @Max(14)
  phMin: number;

  @IsNumber()
  @Min(0)
  @Max(14)
  phMax: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(30)
  ghMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(30)
  ghMax?: number;

  @IsNumber()
  @Min(1)
  minTankSize: number;

  @IsNumber()
  @Min(0)
  sizeMax: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  bioloadLevel?: number;

  @IsOptional()
  @IsEnum(FlowPreference)
  flowPreference?: FlowPreference;

  @IsEnum(CareLevel)
  @IsNotEmpty()
  careLevel: CareLevel;

  @IsEnum(Temperament)
  @IsNotEmpty()
  temperament: Temperament;

  @IsEnum(DietType)
  @IsNotEmpty()
  dietType: DietType;

  @IsOptional()
  @IsBoolean()
  isSchooling?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minSchoolSize?: number;

  @IsOptional()
  @IsBoolean()
  plantSafe?: boolean;

  @IsOptional()
  @IsBoolean()
  substrateDigger?: boolean;

  @IsOptional()
  @IsBoolean()
  jumper?: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}

// Input DTO for updating fish species
export class UpdateFishSpeciesDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nameEn?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nameVn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  scientificName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  aliases?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  tempMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  tempMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(14)
  phMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(14)
  phMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(30)
  ghMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(30)
  ghMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minTankSize?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sizeMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  bioloadLevel?: number;

  @IsOptional()
  @IsEnum(FlowPreference)
  flowPreference?: FlowPreference;

  @IsOptional()
  @IsEnum(CareLevel)
  careLevel?: CareLevel;

  @IsOptional()
  @IsEnum(Temperament)
  temperament?: Temperament;

  @IsOptional()
  @IsEnum(DietType)
  dietType?: DietType;

  @IsOptional()
  @IsBoolean()
  isSchooling?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minSchoolSize?: number;

  @IsOptional()
  @IsBoolean()
  plantSafe?: boolean;

  @IsOptional()
  @IsBoolean()
  substrateDigger?: boolean;

  @IsOptional()
  @IsBoolean()
  jumper?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;
}
