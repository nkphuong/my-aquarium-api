import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { FishSpecies } from '@domain/entities/fish-species.entity';
import {
  CareLevel,
  Temperament,
  DietType,
  FlowPreference,
} from '@domain/enums/fish-species.enum';

@Injectable()
export class FishSpeciesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<FishSpecies | null> {
    const fishSpecies = await this.prisma.fishSpecies.findUnique({
      where: { id },
    });
    return fishSpecies ? this.toDomain(fishSpecies) : null;
  }

  async findAll(): Promise<FishSpecies[]> {
    const fishSpecies = await this.prisma.fishSpecies.findMany();
    return fishSpecies.map((fs) => this.toDomain(fs));
  }

  async findByNameEn(nameEn: string): Promise<FishSpecies | null> {
    const fishSpecies = await this.prisma.fishSpecies.findUnique({
      where: { name_en: nameEn },
    });
    return fishSpecies ? this.toDomain(fishSpecies) : null;
  }

  async findByCareLevel(careLevel: string): Promise<FishSpecies[]> {
    const fishSpecies = await this.prisma.fishSpecies.findMany({
      where: { care_level: careLevel },
    });
    return fishSpecies.map((fs) => this.toDomain(fs));
  }

  async findByTemperament(temperament: string): Promise<FishSpecies[]> {
    const fishSpecies = await this.prisma.fishSpecies.findMany({
      where: { temperament },
    });
    return fishSpecies.map((fs) => this.toDomain(fs));
  }

  async findCompatibleSpecies(waterParams: {
    tempMin: number;
    tempMax: number;
    phMin: number;
    phMax: number;
  }): Promise<FishSpecies[]> {
    const fishSpecies = await this.prisma.fishSpecies.findMany({
      where: {
        AND: [
          { temp_min: { lte: waterParams.tempMax } },
          { temp_max: { gte: waterParams.tempMin } },
          { ph_min: { lte: waterParams.phMax } },
          { ph_max: { gte: waterParams.phMin } },
        ],
      },
    });
    return fishSpecies.map((fs) => this.toDomain(fs));
  }

  async save(entity: FishSpecies): Promise<FishSpecies> {
    const fishSpecies = await this.prisma.fishSpecies.create({
      data: {
        name_en: entity.nameEn,
        name_vn: entity.nameVn,
        temp_min: entity.tempMin,
        temp_max: entity.tempMax,
        ph_min: entity.phMin,
        ph_max: entity.phMax,
        min_tank_size: entity.minTankSize,
        size_max: entity.sizeMax,
        care_level: entity.careLevel,
        temperament: entity.temperament,
        diet_type: entity.dietType,
        description: entity.description,
        ...(entity.scientificName !== undefined && {
          scientific_name: entity.scientificName,
        }),
        ...(entity.aliases.length > 0 && { aliases: entity.aliases }),
        ...(entity.imageUrl !== undefined && { image_url: entity.imageUrl }),
        ...(entity.ghMin !== undefined && { gh_min: entity.ghMin }),
        ...(entity.ghMax !== undefined && { gh_max: entity.ghMax }),
        bioload_level: entity.bioloadLevel,
        flow_preference: entity.flowPreference,
        is_schooling: entity.isSchooling,
        min_school_size: entity.minSchoolSize,
        plant_safe: entity.plantSafe,
        substrate_digger: entity.substrateDigger,
        jumper: entity.jumper,
      },
    });
    return this.toDomain(fishSpecies);
  }

  async update(id: number, entity: Partial<FishSpecies>): Promise<FishSpecies> {
    const fishSpecies = await this.prisma.fishSpecies.update({
      where: { id },
      data: {
        ...(entity.nameEn !== undefined && { name_en: entity.nameEn }),
        ...(entity.nameVn !== undefined && { name_vn: entity.nameVn }),
        ...(entity.scientificName !== undefined && {
          scientific_name: entity.scientificName,
        }),
        ...(entity.aliases !== undefined && { aliases: entity.aliases }),
        ...(entity.imageUrl !== undefined && { image_url: entity.imageUrl }),
        ...(entity.tempMin !== undefined && { temp_min: entity.tempMin }),
        ...(entity.tempMax !== undefined && { temp_max: entity.tempMax }),
        ...(entity.phMin !== undefined && { ph_min: entity.phMin }),
        ...(entity.phMax !== undefined && { ph_max: entity.phMax }),
        ...(entity.ghMin !== undefined && { gh_min: entity.ghMin }),
        ...(entity.ghMax !== undefined && { gh_max: entity.ghMax }),
        ...(entity.minTankSize !== undefined && {
          min_tank_size: entity.minTankSize,
        }),
        ...(entity.sizeMax !== undefined && { size_max: entity.sizeMax }),
        ...(entity.bioloadLevel !== undefined && {
          bioload_level: entity.bioloadLevel,
        }),
        ...(entity.flowPreference !== undefined && {
          flow_preference: entity.flowPreference,
        }),
        ...(entity.careLevel !== undefined && { care_level: entity.careLevel }),
        ...(entity.temperament !== undefined && {
          temperament: entity.temperament,
        }),
        ...(entity.dietType !== undefined && { diet_type: entity.dietType }),
        ...(entity.isSchooling !== undefined && {
          is_schooling: entity.isSchooling,
        }),
        ...(entity.minSchoolSize !== undefined && {
          min_school_size: entity.minSchoolSize,
        }),
        ...(entity.plantSafe !== undefined && { plant_safe: entity.plantSafe }),
        ...(entity.substrateDigger !== undefined && {
          substrate_digger: entity.substrateDigger,
        }),
        ...(entity.jumper !== undefined && { jumper: entity.jumper }),
        ...(entity.description !== undefined && {
          description: entity.description,
        }),
      },
    });
    return this.toDomain(fishSpecies);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.fishSpecies.delete({ where: { id } });
  }

  private toDomain(prismaFishSpecies: any): FishSpecies {
    return new FishSpecies(
      prismaFishSpecies.id,
      prismaFishSpecies.name_en,
      prismaFishSpecies.name_vn,
      prismaFishSpecies.temp_min,
      prismaFishSpecies.temp_max,
      prismaFishSpecies.ph_min,
      prismaFishSpecies.ph_max,
      prismaFishSpecies.min_tank_size,
      prismaFishSpecies.size_max,
      prismaFishSpecies.care_level as CareLevel,
      prismaFishSpecies.temperament as Temperament,
      prismaFishSpecies.diet_type as DietType,
      prismaFishSpecies.description,
      prismaFishSpecies.scientific_name,
      prismaFishSpecies.aliases || [],
      prismaFishSpecies.image_url,
      prismaFishSpecies.gh_min,
      prismaFishSpecies.gh_max,
      prismaFishSpecies.bioload_level,
      prismaFishSpecies.flow_preference as FlowPreference,
      prismaFishSpecies.is_schooling,
      prismaFishSpecies.min_school_size,
      prismaFishSpecies.plant_safe,
      prismaFishSpecies.substrate_digger,
      prismaFishSpecies.jumper,
      prismaFishSpecies.create_at,
      prismaFishSpecies.update_at,
    );
  }
}
