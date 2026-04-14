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

    // Aggression mismatch
    const temp1 = (species1.temperament ?? 'PEACEFUL').toUpperCase();
    const temp2 = (species2.temperament ?? 'PEACEFUL').toUpperCase();
    if (
      (temp1 === 'PEACEFUL' && temp2 === 'AGGRESSIVE') ||
      (temp1 === 'AGGRESSIVE' && temp2 === 'PEACEFUL')
    ) {
      issues.push(
        `Aggression mismatch: ${species1.name_en} (${temp1}) vs ${species2.name_en} (${temp2})`,
      );
      score -= 60;
    } else if (
      (temp1 === 'PEACEFUL' && temp2 === 'SEMI_AGGRESSIVE') ||
      (temp1 === 'SEMI_AGGRESSIVE' && temp2 === 'PEACEFUL')
    ) {
      warnings.push(
        `${temp2 === 'SEMI_AGGRESSIVE' ? species2.name_en : species1.name_en} may bully ${temp1 === 'PEACEFUL' ? species1.name_en : species2.name_en}`,
      );
      score -= 20;
    }

    // Size ratio check (predation risk)
    const size1 = species1.size_max ?? 10;
    const size2 = species2.size_max ?? 10;
    const minSize = Math.min(size1, size2);
    const sizeRatio = minSize > 0 ? Math.max(size1, size2) / minSize : 1;
    if (sizeRatio > 3) {
      warnings.push(
        `Size ratio ${sizeRatio.toFixed(1)}:1 — larger fish may eat smaller`,
      );
      score -= 30;
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
   * Check if schooling species have sufficient numbers
   */
  checkSchoolingRequirements(
    speciesList: Array<{ species: FishSpecies; quantity: number }>,
  ): string[] {
    const warnings: string[] = [];
    for (const { species, quantity } of speciesList) {
      if (species.is_schooling && quantity < (species.min_school_size ?? 6)) {
        warnings.push(
          `${species.name_vn || species.name_en} cần nhóm ít nhất ${species.min_school_size ?? 6} con (hiện có ${quantity})`,
        );
      }
    }
    return warnings;
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
