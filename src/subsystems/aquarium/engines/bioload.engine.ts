import { Injectable } from '@nestjs/common';
import { Fish } from '../entities/fish.entity';
import { FishSpecies } from '../entities/fish-species.entity';
import { Tank } from '../entities/tank.entity';

export interface BioloadValidation {
  canAdd: boolean;
  reason?: string;
  current: number;
  newLoad: number;
  max: number;
  utilizationPercent: number;
}

/**
 * BioloadEngine - Pure business logic for bioload calculations
 *
 * Follows IDesign principles:
 * - NO I/O (no Accessor calls)
 * - Pure calculation logic only
 * - Reusable across multiple Managers
 */
@Injectable()
export class BioloadEngine {
  /**
   * Calculate bioload for a fish based on species data
   * Uses species.bioload_level (1-10 scale) and species.size_max
   */
  calculateFishBioload(species: FishSpecies): number {
    const bioloadLevel = species.bioload_level ?? 5;
    const maxSize = species.size_max ?? 10;

    // Formula: bioload = (bioload_level * size_factor) / 10
    // Where size_factor = max_size / 10 (normalized)
    const sizeFactor = maxSize / 10;
    return bioloadLevel * sizeFactor;
  }

  /**
   * Calculate maximum bioload capacity for a tank
   * Rule of thumb: 1 bioload unit per 4 liters
   */
  calculateMaxBioload(tank: Tank): number {
    const volumeLiters = tank.volume_liters ?? 0;
    return Number(volumeLiters) / 4;
  }

  /**
   * Calculate current total bioload in a tank
   * Uses fish.species (string) to lookup in species map
   */
  calculateCurrentBioload(
    fishList: Fish[],
    speciesMap: Map<string, FishSpecies>,
  ): number {
    return fishList.reduce((total, fish) => {
      const species = speciesMap.get(fish.species);
      if (!species) return total;
      return total + this.calculateFishBioload(species);
    }, 0);
  }

  /**
   * Validate if a new fish can be added to tank without exceeding bioload
   */
  validateTankCapacity(
    tank: Tank,
    currentFish: Fish[],
    newSpecies: FishSpecies,
    speciesMap: Map<string, FishSpecies>,
  ): BioloadValidation {
    const currentLoad = this.calculateCurrentBioload(currentFish, speciesMap);
    const newLoad = this.calculateFishBioload(newSpecies);
    const maxLoad = this.calculateMaxBioload(tank);
    const totalAfterAdd = currentLoad + newLoad;
    const utilizationPercent = Math.round((totalAfterAdd / maxLoad) * 100);

    if (totalAfterAdd > maxLoad) {
      return {
        canAdd: false,
        reason: `Adding this fish would exceed tank capacity. Current: ${currentLoad.toFixed(1)}, New: ${newLoad.toFixed(1)}, Max: ${maxLoad.toFixed(1)}`,
        current: currentLoad,
        newLoad,
        max: maxLoad,
        utilizationPercent,
      };
    }

    return {
      canAdd: true,
      current: currentLoad,
      newLoad,
      max: maxLoad,
      utilizationPercent,
    };
  }

  /**
   * Check if tank bioload is in healthy range
   */
  assessBioloadHealth(
    tank: Tank,
    currentFish: Fish[],
    speciesMap: Map<string, FishSpecies>,
  ): {
    status: 'low' | 'optimal' | 'high' | 'critical';
    percent: number;
    message: string;
  } {
    const current = this.calculateCurrentBioload(currentFish, speciesMap);
    const max = this.calculateMaxBioload(tank);
    const percent = max > 0 ? Math.round((current / max) * 100) : 0;

    if (percent < 50) {
      return { status: 'low', percent, message: 'Tank has room for more fish' };
    }
    if (percent < 75) {
      return {
        status: 'optimal',
        percent,
        message: 'Bioload is at optimal level',
      };
    }
    if (percent < 100) {
      return {
        status: 'high',
        percent,
        message: 'Tank is approaching capacity - monitor closely',
      };
    }
    return {
      status: 'critical',
      percent,
      message: 'Tank is overstocked! Consider rehoming fish or upgrading tank',
    };
  }

  /**
   * Calculate stocking percentage for the public compatibility checker.
   * Accepts raw values instead of Tank/Fish entities.
   */
  calculateStockingPercent(
    tankLiters: number,
    speciesList: Array<{ species: FishSpecies; quantity: number }>,
  ): { percent: number; verdict: 'ok' | 'warning' | 'overstocked' } {
    const maxLoad = tankLiters / 4;
    if (maxLoad <= 0) return { percent: 0, verdict: 'ok' };

    const totalLoad = speciesList.reduce((sum, { species, quantity }) => {
      return sum + this.calculateFishBioload(species) * quantity;
    }, 0);

    const percent = Math.round((totalLoad / maxLoad) * 100);
    let verdict: 'ok' | 'warning' | 'overstocked' = 'ok';
    if (percent >= 100) verdict = 'overstocked';
    else if (percent >= 80) verdict = 'warning';

    return { percent, verdict };
  }
}
