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
  minTankSize: number;
  sizeMax: number;
  careLevel: string;
  temperament: string;
  dietType: string;
  description: string;

  static fromEntity(entity: any): FishSpeciesDto {
    const dto = new FishSpeciesDto();
    dto.id = entity.id;
    dto.nameEn = entity.nameEn;
    dto.nameVn = entity.nameVn;
    dto.scientificName = entity.scientificName;
    dto.aliases = entity.aliases;
    dto.imageUrl = entity.imageUrl;
    dto.tempMin = entity.tempMin;
    dto.tempMax = entity.tempMax;
    dto.phMin = entity.phMin;
    dto.phMax = entity.phMax;
    dto.minTankSize = entity.minTankSize;
    dto.sizeMax = entity.sizeMax;
    dto.careLevel = entity.careLevel;
    dto.temperament = entity.temperament;
    dto.dietType = entity.dietType;
    dto.description = entity.description;
    return dto;
  }

  static fromEntities(entities: any[]): FishSpeciesDto[] {
    return entities.map(FishSpeciesDto.fromEntity);
  }
}
