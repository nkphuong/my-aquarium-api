import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { FishSpecies } from '@domain/entities/fish-species.entity';

@Injectable()
export class FishSpeciesRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(keyword?: string): Promise<FishSpecies[]> {
    const whereClause: any = {};
    if (keyword) {
      whereClause.OR = [
        { name_en: { contains: keyword, mode: 'insensitive' } },
        { name_vn: { contains: keyword, mode: 'insensitive' } },
        { scientific_name: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.fishSpecies.findMany({
      where: whereClause,
      orderBy: { name_en: 'asc' },
    });
    return items.map(this.toDomain);
  }

  async findById(id: number): Promise<FishSpecies | null> {
    const item = await this.prisma.fishSpecies.findUnique({
      where: { id },
    });
    return item ? this.toDomain(item) : null;
  }

  async save(entity: FishSpecies): Promise<FishSpecies> {
    const data = {
      name_en: entity.nameEn,
      name_vn: entity.nameVn,
      scientific_name: entity.scientificName,
      aliases: entity.aliases,
      image_url: entity.imageUrl,

      temp_min: entity.tempMin,
      temp_max: entity.tempMax,
      ph_min: entity.phMin,
      ph_max: entity.phMax,
      gh_min: entity.ghMin,
      gh_max: entity.ghMax,

      min_tank_size: entity.minTankSize,
      size_max: entity.sizeMax,
      bioload_level: entity.bioloadLevel,
      flow_preference: entity.flowPreference,

      care_level: entity.careLevel,
      temperament: entity.temperament,
      diet_type: entity.dietType,

      is_schooling: entity.isSchooling,
      min_school_size: entity.minSchoolSize,
      plant_safe: entity.plantSafe,
      substrate_digger: entity.substrateDigger,
      jumper: entity.jumper,

      description: entity.description,
    };

    if (entity.id && entity.id > 0) {
      const updated = await this.prisma.fishSpecies.update({
        where: { id: entity.id },
        data,
      });
      return this.toDomain(updated);
    } else {
      // Upsert logic based on strict unique constraints (name_en) or just create
      // Simplification: try update if ID exists, else create.
      // For sync jobs, we often match by name or external ID. 
      // Let's assume name_en is unique key for now as per schema.

      const existing = await this.prisma.fishSpecies.findUnique({
        where: { name_en: entity.nameEn }
      });

      if (existing) {
        const updated = await this.prisma.fishSpecies.update({
          where: { id: existing.id },
          data,
        });
        return this.toDomain(updated);
      }

      const created = await this.prisma.fishSpecies.create({ data });
      return this.toDomain(created);
    }
  }

  private toDomain(prismaItem: any): FishSpecies {
    return new FishSpecies(
      prismaItem.id,
      prismaItem.name_en,
      prismaItem.name_vn,
      prismaItem.temp_min,
      prismaItem.temp_max,
      prismaItem.ph_min,
      prismaItem.ph_max,
      prismaItem.min_tank_size,
      prismaItem.size_max,
      prismaItem.care_level,
      prismaItem.temperament,
      prismaItem.diet_type,
      prismaItem.description,
      prismaItem.scientific_name,
      prismaItem.aliases,
      prismaItem.image_url,
      prismaItem.gh_min,
      prismaItem.gh_max,
      prismaItem.bioload_level,
      prismaItem.flow_preference,
      prismaItem.is_schooling,
      prismaItem.min_school_size,
      prismaItem.plant_safe,
      prismaItem.substrate_digger,
      prismaItem.jumper,
      prismaItem.create_at,
      prismaItem.update_at,
    );
  }
}
