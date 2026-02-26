import { Injectable, Inject } from '@nestjs/common';
import { Fish } from '@accessors/livestock/entities/fish.entity';
import { Livestock } from '@accessors/livestock/entities/livestock.entity';
import { FishSpecies } from '@accessors/livestock/entities/fish-species.entity';
import { LivestockStatus } from '@accessors/livestock/enums/livestock.enum';

// Accessors
import type { IFishAccessor } from '@accessors/livestock/accessors/fish.accessor.interface';
import { FISH_ACCESSOR } from '@accessors/livestock/accessors/fish.accessor.interface';
import type { ILivestockAccessor } from '@accessors/livestock/accessors/livestock.accessor.interface';
import { LIVESTOCK_ACCESSOR } from '@accessors/livestock/accessors/livestock.accessor.interface';
import type { IFishSpeciesAccessor } from '@accessors/livestock/accessors/fish-species.accessor.interface';
import { FISH_SPECIES_ACCESSOR } from '@accessors/livestock/accessors/fish-species.accessor.interface';

// Exceptions
import { FishNotFoundException } from '../exceptions/fish-not-found.exception';
import { LivestockNotFoundException } from '../exceptions/livestock-not-found.exception';
import { FishSpeciesNotFoundException } from '../exceptions/fish-species-not-found.exception';

// Requests
import {
  CreateLivestockRequest,
  UpdateLivestockRequest,
} from '../requests/livestock.request';

@Injectable()
export class InventoryManager {
  constructor(
    @Inject(FISH_ACCESSOR) private readonly fishAccessor: IFishAccessor,
    @Inject(LIVESTOCK_ACCESSOR)
    private readonly livestockAccessor: ILivestockAccessor,
    @Inject(FISH_SPECIES_ACCESSOR)
    private readonly fishSpeciesAccessor: IFishSpeciesAccessor,
  ) {}

  // ===== Fish CRUD =====

  async createFish(data: {
    name: string;
    species: string;
    tankId?: number;
  }): Promise<Fish> {
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

  async createLivestock(dto: CreateLivestockRequest): Promise<Livestock> {
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
    dto: UpdateLivestockRequest,
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
}
