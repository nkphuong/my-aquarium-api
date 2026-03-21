import { Injectable } from '@nestjs/common';
import { FishSpecies } from '../entities/fish-species.entity';
import { Fish } from '../entities/fish.entity';

export interface CompatibilityResult {
  compatible: boolean;
  score: number; // 0-100
  warnings: string[];
  issues: string[];
}

export interface NewFishCompatibility {
  canAdd: boolean;
  overallScore: number;
  incompatibilities: CompatibilityResult[];
  warnings: string[];
}

/**
 * CompatibilityEngine - Pure business logic for species compatibility
 *
 * Follows IDesign principles:
 * - NO I/O (no Accessor calls)
 * - Pure calculation logic only
 * - Reusable across multiple Managers
 */
@Injectable()
export class CompatibilityEngine {
  /**
   * Check if two species can coexist based on water parameters and temperament
   */
  areSpeciesCompatible(
    species1: FishSpecies,
    species2: FishSpecies,
  ): CompatibilityResult {
    const warnings: string[] = [];
    const issues: string[] = [];
    let score = 100;

    // Temperature compatibility - ranges must overlap
    const tempOverlap = this.rangesOverlap(
      species1.temp_min,
      species1.temp_max,
      species2.temp_min,
      species2.temp_max,
    );
    if (!tempOverlap.overlaps) {
      issues.push(
        `Temperature incompatible: ${species1.name_en} (${species1.temp_min}-${species1.temp_max}°C) vs ${species2.name_en} (${species2.temp_min}-${species2.temp_max}°C)`,
      );
      score = 0;
    } else if (tempOverlap.overlapPercent < 50) {
      warnings.push(
        `Limited temperature overlap between ${species1.name_en} and ${species2.name_en}`,
      );
      score -= 20;
    }

    // pH compatibility - ranges must overlap
    const phOverlap = this.rangesOverlap(
      species1.ph_min,
      species1.ph_max,
      species2.ph_min,
      species2.ph_max,
    );
    if (!phOverlap.overlaps) {
      issues.push(
        `pH incompatible: ${species1.name_en} (${species1.ph_min}-${species1.ph_max}) vs ${species2.name_en} (${species2.ph_min}-${species2.ph_max})`,
      );
      score = 0;
    } else if (phOverlap.overlapPercent < 50) {
      warnings.push(
        `Limited pH overlap between ${species1.name_en} and ${species2.name_en}`,
      );
      score -= 15;
    }

    // Size compatibility - very different sizes can cause aggression
    const sizeDiff = Math.abs(
      (species1.size_max ?? 10) - (species2.size_max ?? 10),
    );
    if (sizeDiff > 15) {
      warnings.push(
        `Large size difference (${sizeDiff}cm) - smaller fish may be bullied or eaten`,
      );
      score -= 25;
    } else if (sizeDiff > 10) {
      warnings.push(`Notable size difference between species`);
      score -= 10;
    }

    return {
      compatible: issues.length === 0,
      score: Math.max(0, score),
      warnings,
      issues,
    };
  }

  /**
   * Check if new species is compatible with all existing tank inhabitants
   */
  validateNewFishCompatibility(
    newSpecies: FishSpecies,
    existingFish: Fish[],
    speciesMap: Map<string, FishSpecies>,
  ): NewFishCompatibility {
    const incompatibilities: CompatibilityResult[] = [];
    const allWarnings: string[] = [];
    let totalScore = 100;
    let checkedCount = 0;

    // Get unique species names from existing fish
    const existingSpeciesNames = [
      ...new Set(existingFish.map((f) => f.species)),
    ];

    for (const speciesName of existingSpeciesNames) {
      const existingSpecies = speciesMap.get(speciesName);
      if (!existingSpecies) continue;

      // Skip self-compatibility check
      if (existingSpecies.id === newSpecies.id) continue;

      const result = this.areSpeciesCompatible(newSpecies, existingSpecies);
      checkedCount++;

      if (!result.compatible) {
        incompatibilities.push(result);
      }

      allWarnings.push(...result.warnings);
      totalScore = Math.min(totalScore, result.score);
    }

    return {
      canAdd: incompatibilities.every((i) => i.compatible !== false),
      overallScore: checkedCount > 0 ? totalScore : 100,
      incompatibilities: incompatibilities.filter((i) => !i.compatible),
      warnings: allWarnings,
    };
  }

  /**
   * Get optimal water parameters for a group of species
   */
  getOptimalParameters(speciesList: FishSpecies[]): {
    temp: { min: number; max: number };
    ph: { min: number; max: number };
  } | null {
    if (speciesList.length === 0) return null;

    // Find overlapping ranges
    const tempMin = Math.max(...speciesList.map((s) => s.temp_min));
    const tempMax = Math.min(...speciesList.map((s) => s.temp_max));
    const phMin = Math.max(...speciesList.map((s) => s.ph_min));
    const phMax = Math.min(...speciesList.map((s) => s.ph_max));

    // Check if valid overlapping range exists
    if (tempMin > tempMax || phMin > phMax) {
      return null;
    }

    return {
      temp: { min: tempMin, max: tempMax },
      ph: { min: phMin, max: phMax },
    };
  }

  /**
   * Helper: Check if two numerical ranges overlap
   */
  private rangesOverlap(
    min1: number,
    max1: number,
    min2: number,
    max2: number,
  ): { overlaps: boolean; overlapPercent: number } {
    const overlapStart = Math.max(min1, min2);
    const overlapEnd = Math.min(max1, max2);

    if (overlapStart > overlapEnd) {
      return { overlaps: false, overlapPercent: 0 };
    }

    const overlapSize = overlapEnd - overlapStart;
    const smallerRange = Math.min(max1 - min1, max2 - min2);
    const overlapPercent =
      smallerRange > 0 ? (overlapSize / smallerRange) * 100 : 100;

    return { overlaps: true, overlapPercent };
  }
}
