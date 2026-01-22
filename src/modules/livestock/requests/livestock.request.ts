import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, Min, IsUrl, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { BaseRequest } from '@core/requests/base.request';
import { LivestockType, LivestockStatus } from '@modules/livestock/enums/livestock.enum';

export class CreateLivestockRequest extends BaseRequest {
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

export class UpdateLivestockRequest extends PartialType(CreateLivestockRequest) { }
