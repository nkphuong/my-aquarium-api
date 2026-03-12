import { Injectable, Inject } from '@nestjs/common';
import { Fish } from '@entities/fish.entity';
import { Livestock } from '@entities/livestock.entity';
import { FishSpecies } from '@entities/fish-species.entity';
import { LivestockStatus } from '@accessors/livestock/enums/livestock.enum';
import {
  ICreateFishCommand,
  ICreateLivestockCommand,
  IUpdateLivestockCommand,
  ICreateFishSpeciesCommand,
} from './interfaces/inventory.manager.interface';

// Accessors
import type { IFishAccessor } from '@accessors/livestock/interfaces/fish.accessor.interface';
import { FISH_ACCESSOR } from '@accessors/livestock/interfaces/fish.accessor.interface';
import type { ILivestockAccessor } from '@accessors/livestock/interfaces/livestock.accessor.interface';
import { LIVESTOCK_ACCESSOR } from '@accessors/livestock/interfaces/livestock.accessor.interface';
import type { IFishSpeciesAccessor } from '@accessors/livestock/interfaces/fish-species.accessor.interface';
import { FISH_SPECIES_ACCESSOR } from '@accessors/livestock/interfaces/fish-species.accessor.interface';

// Exceptions
import { FishNotFoundException } from '../exceptions/fish-not-found.exception';
import { LivestockNotFoundException } from '../exceptions/livestock-not-found.exception';
import { FishSpeciesNotFoundException } from '../exceptions/fish-species-not-found.exception';

// Engines
import { FishSpeciesEngine } from '@engines/fish-species.engine';

// Requests
// Removed HTTP Request imports as they are decoupled via interfaces

@Injectable()
export class InventoryManager {
  constructor(
    @Inject(FISH_ACCESSOR) private readonly fishAccessor: IFishAccessor,
    @Inject(LIVESTOCK_ACCESSOR)
    private readonly livestockAccessor: ILivestockAccessor,
    @Inject(FISH_SPECIES_ACCESSOR)
    private readonly fishSpeciesAccessor: IFishSpeciesAccessor,
    private readonly fishSpeciesEngine: FishSpeciesEngine,
  ) { }

  // ===== Fish CRUD =====

  async createFish(data: ICreateFishCommand): Promise<Fish> {
    const fish = new Fish();
    fish.fill({
      name: data.name,
      species: data.species,
      tank_id: data.tankId,
    } as any);
    return this.fishAccessor.save(fish);
  }

  async findFishById(id: number): Promise<Fish> {
    const fish = await this.fishAccessor.findById(id);
    if (!fish) throw new FishNotFoundException(id);
    return fish;
  }

  async findAllFish(): Promise<Fish[]> {
    return this.fishAccessor.findAll();
  }

  async deleteFish(id: number): Promise<void> {
    const fish = await this.fishAccessor.findById(id);
    if (!fish) throw new FishNotFoundException(id);
    await this.fishAccessor.delete(id);
  }

  // ===== Livestock CRUD =====

  async createLivestock(dto: ICreateLivestockCommand): Promise<Livestock> {
    const entity = new Livestock();
    entity.fill({
      name: dto.name,
      type: dto.type,
      quantity: dto.quantity || 1,
      status: dto.status || LivestockStatus.HEALTHY,
      addedDate: dto.addedDate ? new Date(dto.addedDate) : new Date(),
      tankId: dto.tankId,
      scientificName: dto.scientificName,
      fishbaseId: dto.fishbaseId,
      imageUrl: dto.imageUrl,
    } as any);
    return this.livestockAccessor.save(entity);
  }

  async findLivestockByTankId(tankId: number): Promise<Livestock[]> {
    return this.livestockAccessor.findByTankId(tankId);
  }

  async findLivestockById(id: number): Promise<Livestock> {
    const item = await this.livestockAccessor.findById(id);
    if (!item) throw new LivestockNotFoundException(id);
    return item;
  }

  async updateLivestock(
    id: number,
    dto: IUpdateLivestockCommand,
  ): Promise<Livestock> {
    const item = await this.livestockAccessor.findById(id);
    if (!item) throw new LivestockNotFoundException(id);
    item.fill({
      name: dto.name ?? item.name,
      scientific_name: dto.scientificName ?? item.scientific_name,
      image_url: dto.imageUrl ?? item.image_url,
      added_date: dto.addedDate ? new Date(dto.addedDate) : item.added_date,
      quantity: dto.quantity ?? item.quantity,
      status: dto.status ?? item.status,
    } as any);
    return this.livestockAccessor.update(id, item);
  }

  async deleteLivestock(id: number): Promise<void> {
    const item = await this.livestockAccessor.findById(id);
    if (!item) throw new LivestockNotFoundException(id);
    await this.livestockAccessor.delete(id);
  }

  // ===== FishSpecies Query (Reference Data) =====

  async findAllFishSpecies(keyword?: string): Promise<FishSpecies[]> {
    return this.fishSpeciesAccessor.findAll(keyword);
  }

  async findFishSpeciesById(id: number): Promise<FishSpecies> {
    const species = await this.fishSpeciesAccessor.findById(id);
    if (!species) throw new FishSpeciesNotFoundException(id);
    return species;
  }

  async createFishSpecies(dto: ICreateFishSpeciesCommand): Promise<FishSpecies> {
    const userPrompt = this.fishSpeciesEngine.prepareUserPrompt(dto);
    const config = {
      jsonSchema: this.fishSpeciesEngine.getResponseJsonSchema(),
      systemInstruction: this.fishSpeciesEngine.getSystemInstruction(),
    };
    const response = await this.fishSpeciesAccessor.generateContent(userPrompt, config);
    const fishSpeciesData = this.fishSpeciesEngine.parseFishSpecies(response);

    const entity = new FishSpecies();
    entity.fill({
      name_en: fishSpeciesData.name_en,
      name_vn: fishSpeciesData.name_vn,
      scientific_name: fishSpeciesData.scientific_name,
      image_url: fishSpeciesData.image_url || '',
      aliases: fishSpeciesData.aliases || [],
      temp_min: fishSpeciesData.temp_min,
      temp_max: fishSpeciesData.temp_max,
      ph_min: fishSpeciesData.ph_min,
      ph_max: fishSpeciesData.ph_max,
      gh_min: fishSpeciesData.gh_min,
      gh_max: fishSpeciesData.gh_max,
      min_tank_size: fishSpeciesData.min_tank_size,
      size_max: fishSpeciesData.size_max,
      bioload_level: fishSpeciesData.bioload_level,
      flow_preference: fishSpeciesData.flow_preference,
      care_level: fishSpeciesData.care_level,
      temperament: fishSpeciesData.temperament,
      diet_type: fishSpeciesData.diet_type,
      is_schooling: fishSpeciesData.is_schooling,
      min_school_size: fishSpeciesData.min_school_size,
      plant_safe: fishSpeciesData.plant_safe,
      substrate_digger: fishSpeciesData.substrate_digger,
      jumper: fishSpeciesData.jumper,
      description: fishSpeciesData.description,
    } as any);


    return this.fishSpeciesAccessor.save(entity);
  }
}
