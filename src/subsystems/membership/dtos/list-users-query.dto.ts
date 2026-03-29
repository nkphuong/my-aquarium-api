import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  MaxLength,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum UserSortField {
  ID = 'id',
  EMAIL = 'email',
  FULLNAME = 'fullname',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ListUsersQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @IsOptional()
  @Transform(({ value }): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean | undefined;
  })
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsEnum(UserSortField)
  sortBy?: UserSortField;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;
}
