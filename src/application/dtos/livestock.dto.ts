import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, Min, IsUrl, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { LivestockType, LivestockStatus } from '@domain/enums/livestock.enum';

export class LivestockDto {
    id: number;
    tankId?: number;
    name: string;
    scientificName?: string;
    fishbaseId?: number;
    type: LivestockType;
    quantity: number;
    status: LivestockStatus;
    imageUrl?: string;
    addedDate: Date;
    createdAt: Date;
    updatedAt: Date;

    static fromEntity(entity: any): LivestockDto {
        const dto = new LivestockDto();
        dto.id = entity.id;
        dto.tankId = entity.tank_id;
        dto.name = entity.name;
        dto.scientificName = entity.scientific_name;
        dto.fishbaseId = entity.fishbase_id;
        dto.type = entity.type;
        dto.quantity = entity.quantity;
        dto.status = entity.status;
        dto.imageUrl = entity.image_url;
        dto.addedDate = entity.added_date;
        dto.createdAt = entity.created_at;
        dto.updatedAt = entity.updated_at;
        return dto;
    }

    static fromEntities(entities: any[]): LivestockDto[] {
        return entities.map(LivestockDto.fromEntity);
    }
}

export class CreateLivestockDto {
    @IsInt()
    @IsNotEmpty()
    tankId: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    scientificName?: string;

    @IsOptional()
    @IsInt()
    fishbaseId?: number;

    @IsEnum(LivestockType)
    @IsNotEmpty()
    type: LivestockType;

    @IsInt()
    @Min(1)
    @IsOptional()
    quantity?: number = 1;

    @IsEnum(LivestockStatus)
    @IsOptional()
    status?: LivestockStatus = LivestockStatus.HEALTHY;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsDateString()
    addedDate?: Date;
}

export class UpdateLivestockDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    scientificName?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    quantity?: number;

    @IsOptional()
    @IsEnum(LivestockStatus)
    status?: LivestockStatus;

    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsDateString()
    addedDate?: Date;
}
