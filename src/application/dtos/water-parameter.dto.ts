import { IsNumber, IsOptional, IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class WaterParameterDto {
    id: number;
    tankId: number;
    testedAt: Date;
    temperature?: number;
    ph?: number;
    ammonia?: number;
    nitrite?: number;
    nitrate?: number;
    gh?: number;
    kh?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;

    static fromEntity(entity: any): WaterParameterDto {
        const dto = new WaterParameterDto();
        dto.id = entity.id;
        dto.tankId = entity.tank_id;
        dto.testedAt = entity.tested_at;
        dto.temperature = entity.temperature;
        dto.ph = entity.ph;
        dto.ammonia = entity.ammonia;
        dto.nitrite = entity.nitrite;
        dto.nitrate = entity.nitrate;
        dto.gh = entity.gh;
        dto.kh = entity.kh;
        dto.notes = entity.notes;
        dto.createdAt = entity.created_at;
        dto.updatedAt = entity.updated_at;
        return dto;
    }

    static fromEntities(entities: any[]): WaterParameterDto[] {
        return entities.map(WaterParameterDto.fromEntity);
    }
}

export class CreateWaterParameterDto {
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
