import { Injectable, Inject } from '@nestjs/common';

import {
  CreateTankRequest,
  UpdateTankRequest,
} from '../../../accessors/aquarium/requests/tank.request';
import { Tank } from '@accessors/aquarium/entities/tank.entity';
import { Fish } from '@accessors/livestock/entities/fish.entity';
import { PaginatedResult } from '@core/types/pagination';

// Accessors
import type { ITankAccessor } from '@accessors/aquarium/accessors/tank.accessor.interface';
import { TANK_ACCESSOR } from '@accessors/aquarium/accessors/tank.accessor.interface';
import type { IFishAccessor } from '@accessors/livestock/accessors/fish.accessor.interface';
import { FISH_ACCESSOR } from '@accessors/livestock/accessors/fish.accessor.interface';
import type { IFishSpeciesAccessor } from '@accessors/livestock/accessors/fish-species.accessor.interface';
import { FISH_SPECIES_ACCESSOR } from '@accessors/livestock/accessors/fish-species.accessor.interface';

// Exceptions
import { TankNotFoundException } from '../exceptions';
import { FishSpeciesNotFoundException } from '@managers/inventory/exceptions';

// Engines - Pure Business Logic
import { BioloadEngine, BioloadValidation } from '@engines/bioload.engine';
import {
  CompatibilityEngine,
  NewFishCompatibility,
} from '@engines/compatibility.engine';
import { FishSpecies } from '@accessors/livestock/entities/fish-species.entity';

// Result types for orchestrated operations
export interface AddFishResult {
  success: boolean;
  fish?: Fish;
  bioload: BioloadValidation;
  compatibility: NewFishCompatibility;
}

export interface TankDashboard {
  tank: Tank;
  fishCount: number;
  bioloadHealth: { status: string; percent: number; message: string };
  compatibility: { overallScore: number; warnings: string[] };
}

@Injectable()
export class AquariumManager {
  constructor(
    // Accessors - Data Layer
    @Inject(TANK_ACCESSOR) private readonly tankAccessor: ITankAccessor,
    @Inject(FISH_ACCESSOR) private readonly fishAccessor: IFishAccessor,
    @Inject(FISH_SPECIES_ACCESSOR)
    private readonly fishSpeciesAccessor: IFishSpeciesAccessor,

    // Engines - Pure Business Logic
    private readonly bioloadEngine: BioloadEngine,
    private readonly compatibilityEngine: CompatibilityEngine,
  ) {}

  async createTank(dto: CreateTankRequest, userId: number): Promise<Tank> {
    const tank = new Tank();
    tank.fill({
      name: dto.name,
      length: dto.length,
      width: dto.width,
      height: dto.height,
      volume_liters: dto.volume_liters,
      tank_type: dto.tank_type,
      style: dto.style,
      description: dto.description,
      setup_date: dto.setup_date,
      cover_image_url: dto.cover_image_url,
      substrate: dto.substrate,
      filter_type: dto.filter_type,
      is_archived: false,
    } as any);

    tank.assignToUser(userId);
    const saved = await this.tankAccessor.save(tank);
    return saved;
  }

  async findAllTanks(
    page: number,
    perPage: number,
    includeArchived: boolean = false,
  ): Promise<PaginatedResult<Tank>> {
    const paginatedTanks = await this.tankAccessor.findAll(
      page,
      perPage,
      includeArchived,
    );
    return PaginatedResult.create(paginatedTanks.data, paginatedTanks.meta);
  }

  async findTankById(id: number): Promise<Tank> {
    const tank = await this.tankAccessor.findById(id);
    if (!tank) {
      throw new TankNotFoundException(id);
    }
    return tank;
  }

  async findTanksByUserId(userId: number): Promise<Tank[]> {
    const tanks = await this.tankAccessor.findByUserId(userId);
    return tanks;
  }

  async updateTank(id: number, dto: UpdateTankRequest): Promise<Tank> {
    const tank = await this.tankAccessor.findById(id);
    if (!tank) {
      throw new TankNotFoundException(id);
    }

    tank.fill({
      name: dto.name ?? tank.name,
      length: dto.length ?? tank.length,
      width: dto.width ?? tank.width,
      height: dto.height ?? tank.height,
      volume_liters: dto.volume_liters ?? tank.volume_liters,
      tank_type: dto.tank_type ?? tank.tank_type,
      style: dto.style ?? tank.style,
      description: dto.description ?? tank.description,
      setup_date: dto.setup_date ?? tank.setup_date,
      cover_image_url: dto.cover_image_url ?? tank.cover_image_url,
      substrate: dto.substrate ?? tank.substrate,
      filter_type: dto.filter_type ?? tank.filter_type,
    } as any);

    const updated = await this.tankAccessor.update(id, tank);
    return updated;
  }

  async archiveTank(id: number): Promise<Tank> {
    const tank = await this.tankAccessor.findById(id);
    if (!tank) {
      throw new TankNotFoundException(id);
    }
    tank.archive();
    const updated = await this.tankAccessor.update(id, tank);
    return updated;
  }

  async unarchiveTank(id: number): Promise<Tank> {
    const tank = await this.tankAccessor.findById(id);
    if (!tank) {
      throw new TankNotFoundException(id);
    }
    tank.unarchive();
    const updated = await this.tankAccessor.update(id, tank);
    return updated;
  }

  async deleteTank(id: number): Promise<void> {
    const tank = await this.tankAccessor.findById(id);
    if (!tank) {
      throw new TankNotFoundException(id);
    }
    await this.tankAccessor.delete(id);
  }

  async assignTankToUser(tankId: number, userId: number): Promise<Tank> {
    const tank = await this.tankAccessor.findById(tankId);
    if (!tank) {
      throw new TankNotFoundException(tankId);
    }
    tank.assignToUser(userId);
    const updated = await this.tankAccessor.update(tankId, tank);
    return updated;
  }

  async removeTankFromUser(tankId: number): Promise<Tank> {
    const tank = await this.tankAccessor.findById(tankId);
    if (!tank) {
      throw new TankNotFoundException(tankId);
    }
    tank.removeFromUser();
    const updated = await this.tankAccessor.update(tankId, tank);
    return updated;
  }

  // ===== IDesign Pattern: Manager Orchestrates Engines & Accessors =====

  /**
   * Add fish to tank with bioload and compatibility validation
   * This is the IDesign pattern: Manager orchestrates Engines (pure logic) and Accessors (I/O)
   */
  async addFishToTank(tankId: number, fishId: number): Promise<AddFishResult> {
    // 1. Fetch data via Accessors
    const [tank, fish, currentFishInTank, allSpecies] = await Promise.all([
      this.tankAccessor.findById(tankId),
      this.fishAccessor.findById(fishId),
      this.fishAccessor.findByTankId(tankId),
      this.fishSpeciesAccessor.findAll(),
    ]);

    if (!tank) throw new TankNotFoundException(tankId);
    if (!fish) throw new FishSpeciesNotFoundException(fishId);

    // Build species lookup map (keyed by name since schema uses string species)
    const speciesMap = new Map<string, FishSpecies>();
    for (const s of allSpecies) {
      speciesMap.set(s.name_en, s);
    }

    // 2. Use Engines for pure business logic validation
    const fishSpecies = speciesMap.get(fish.species);

    // Default species for fish without matching species data
    const defaultSpecies = new FishSpecies();
    defaultSpecies.fill({
      name_en: fish.species,
      bioload_level: 5,
      size_max: 10,
      temp_min: 22,
      temp_max: 28,
      ph_min: 6.5,
      ph_max: 7.5,
    } as any);

    const speciesForValidation = fishSpecies ?? defaultSpecies;

    // Engine 1: Bioload Validation
    const bioloadResult = this.bioloadEngine.validateTankCapacity(
      tank,
      currentFishInTank,
      speciesForValidation,
      speciesMap,
    );

    // Engine 2: Compatibility Validation
    const compatibilityResult =
      this.compatibilityEngine.validateNewFishCompatibility(
        speciesForValidation,
        currentFishInTank,
        speciesMap,
      );

    // 3. Decision: Only proceed if both validations pass
    if (!bioloadResult.canAdd || !compatibilityResult.canAdd) {
      return {
        success: false,
        bioload: bioloadResult,
        compatibility: compatibilityResult,
      };
    }

    // 4. Execute state change via Accessor
    fish.assignToTank(tankId);
    const savedFish = await this.fishAccessor.save(fish);

    return {
      success: true,
      fish: savedFish,
      bioload: bioloadResult,
      compatibility: compatibilityResult,
    };
  }

  /**
   * Get comprehensive tank dashboard using Engines for analysis
   */
  async getTankDashboard(tankId: number): Promise<TankDashboard> {
    const [tank, fishInTank, allSpecies] = await Promise.all([
      this.tankAccessor.findById(tankId),
      this.fishAccessor.findByTankId(tankId),
      this.fishSpeciesAccessor.findAll(),
    ]);

    if (!tank) throw new TankNotFoundException(tankId);

    // Build species lookup map
    const speciesMap = new Map<string, FishSpecies>();
    for (const s of allSpecies) {
      speciesMap.set(s.name_en, s);
    }

    // Use Engines for analysis
    const bioloadHealth = this.bioloadEngine.assessBioloadHealth(
      tank,
      fishInTank,
      speciesMap,
    );

    // Calculate overall compatibility score
    const speciesInTank = [...new Set(fishInTank.map((f) => f.species))]
      .map((name) => speciesMap.get(name))
      .filter((s): s is FishSpecies => s !== undefined);

    const optimalParams =
      this.compatibilityEngine.getOptimalParameters(speciesInTank);
    const warnings: string[] = [];

    if (!optimalParams && speciesInTank.length > 1) {
      warnings.push(
        'Some species have incompatible water parameter requirements',
      );
    }

    return {
      tank,
      fishCount: fishInTank.length,
      bioloadHealth,
      compatibility: {
        overallScore: optimalParams ? 100 : speciesInTank.length > 1 ? 50 : 100,
        warnings,
      },
    };
  }
}
