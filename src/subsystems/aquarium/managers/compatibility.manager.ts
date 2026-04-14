import { Injectable, Inject } from '@nestjs/common';
import { FISH_SPECIES_ACCESSOR } from '../contracts/fish-species.accessor.interface';
import type { IFishSpeciesAccessor } from '../contracts/fish-species.accessor.interface';
import { COMPATIBILITY_OVERRIDE_ACCESSOR } from '../contracts/compatibility-override.accessor.interface';
import type { ICompatibilityOverrideAccessor } from '../contracts/compatibility-override.accessor.interface';
import { CompatibilityEngine } from '../engines/compatibility.engine';
import { BioloadEngine } from '../engines/bioload.engine';
import { ValidationException } from '@core/exceptions/domain.exception';
import type {
  CompatibilityCheckRequestDTO,
  CompatibilityCheckResponseDTO,
  CompatibilityPairResult,
  SpeciesBreakdownItem,
  SpeciesListItemDTO,
} from '../dtos/compatibility-check.dto';
import type { FishSpecies } from '../entities/fish-species.entity';

@Injectable()
export class CompatibilityManager {
  constructor(
    @Inject(FISH_SPECIES_ACCESSOR)
    private readonly fishSpeciesAccessor: IFishSpeciesAccessor,
    @Inject(COMPATIBILITY_OVERRIDE_ACCESSOR)
    private readonly overrideAccessor: ICompatibilityOverrideAccessor,
    private readonly compatibilityEngine: CompatibilityEngine,
    private readonly bioloadEngine: BioloadEngine,
  ) {}

  async checkCompatibility(
    dto: CompatibilityCheckRequestDTO,
  ): Promise<CompatibilityCheckResponseDTO> {
    if (!dto.species || dto.species.length === 0) {
      throw new ValidationException('At least 1 species required');
    }
    if (dto.tank_size_liters <= 0) {
      throw new ValidationException('Tank size must be positive');
    }
    if (dto.species.length > 20) {
      throw new ValidationException('Maximum 20 species per check');
    }

    // Resolve species IDs to entities
    const speciesEntities: Array<{ species: FishSpecies; quantity: number }> = [];
    for (const item of dto.species) {
      const species = await this.fishSpeciesAccessor.findById(item.id);
      if (!species) {
        throw new ValidationException(`Unknown species: ${item.id}`);
      }
      speciesEntities.push({ species, quantity: item.quantity });
    }

    // Load overrides in bulk
    const speciesIds = speciesEntities.map((s) => s.species.id);
    const overrides = await this.overrideAccessor.findBySpeciesSet(speciesIds);
    const overrideMap = new Map(
      overrides.map((o) => [
        `${Math.min(o.species_a_id, o.species_b_id)}-${Math.max(o.species_a_id, o.species_b_id)}`,
        o,
      ]),
    );

    // Pairwise compatibility checks
    const pairs: CompatibilityPairResult[] = [];
    for (let i = 0; i < speciesEntities.length; i++) {
      for (let j = i + 1; j < speciesEntities.length; j++) {
        const a = speciesEntities[i].species;
        const b = speciesEntities[j].species;

        const key = `${Math.min(a.id, b.id)}-${Math.max(a.id, b.id)}`;
        const override = overrideMap.get(key);

        if (override) {
          pairs.push({
            species_a_id: a.id,
            species_a_name: a.name_vn || a.name_en,
            species_b_id: b.id,
            species_b_name: b.name_vn || b.name_en,
            verdict: override.verdict as 'compatible' | 'risky' | 'incompatible',
            score: override.verdict === 'compatible' ? 90 : override.verdict === 'risky' ? 50 : 10,
            reasons_vn: [override.reason_vn],
            reasons_en: [override.reason_en],
          });
        } else {
          const result = this.compatibilityEngine.areSpeciesCompatible(a, b);
          const verdict =
            result.score >= 70 ? 'compatible' : result.score >= 40 ? 'risky' : 'incompatible';
          pairs.push({
            species_a_id: a.id,
            species_a_name: a.name_vn || a.name_en,
            species_b_id: b.id,
            species_b_name: b.name_vn || b.name_en,
            verdict,
            score: result.score,
            reasons_vn: [...result.issues, ...result.warnings],
            reasons_en: [...result.issues, ...result.warnings],
          });
        }
      }
    }

    // Schooling warnings
    const schoolingWarnings =
      this.compatibilityEngine.checkSchoolingRequirements(speciesEntities);

    // Stocking calculation
    const stocking = this.bioloadEngine.calculateStockingPercent(
      dto.tank_size_liters,
      speciesEntities,
    );

    // Build species breakdown
    const tankCapacity = dto.tank_size_liters / 4;
    const totalBioload = speciesEntities.reduce((sum, { species, quantity }) => {
      return sum + this.bioloadEngine.calculateFishBioload(species) * quantity;
    }, 0);

    const speciesBreakdown: SpeciesBreakdownItem[] = speciesEntities.map(
      ({ species, quantity }) => {
        const bioloadPerFish = this.bioloadEngine.calculateFishBioload(species);
        const maxAdditional =
          bioloadPerFish > 0
            ? Math.max(0, Math.floor((tankCapacity * 0.8 - totalBioload) / bioloadPerFish))
            : 0;

        return {
          species_id: species.id,
          name_en: species.name_en,
          name_vn: species.name_vn,
          quantity,
          bioload_per_fish: Math.round(bioloadPerFish * 100) / 100,
          bioload_total: Math.round(bioloadPerFish * quantity * 100) / 100,
          max_additional: maxAdditional,
          is_schooling: species.is_schooling ?? false,
          min_school_size: species.min_school_size ?? 1,
          schooling_warning:
            (species.is_schooling ?? false) && quantity < (species.min_school_size ?? 1),
        };
      },
    );

    // Overall verdict from worst pair
    const worstPairScore =
      pairs.length > 0 ? Math.min(...pairs.map((p) => p.score)) : 100;
    const overall_verdict =
      worstPairScore >= 70 ? 'compatible' : worstPairScore >= 40 ? 'risky' : 'incompatible';

    return {
      stocking_percent: stocking.percent,
      stocking_verdict: stocking.verdict,
      pairs,
      warnings: [
        ...schoolingWarnings,
        ...(stocking.verdict === 'overstocked' ? ['Hồ cá đã quá tải!'] : []),
        ...(stocking.verdict === 'warning' ? ['Hồ cá gần đầy, theo dõi cẩn thận'] : []),
      ],
      overall_verdict,
      species_breakdown: speciesBreakdown,
      tank_capacity: Math.round(tankCapacity * 100) / 100,
      total_bioload: Math.round(totalBioload * 100) / 100,
      remaining_capacity: Math.round((tankCapacity - totalBioload) * 100) / 100,
    };
  }

  async getSpeciesList(): Promise<SpeciesListItemDTO[]> {
    const species = await this.fishSpeciesAccessor.findAll();
    return species.map((s) => ({
      id: s.id,
      name_vn: s.name_vn,
      name_scientific: s.scientific_name ?? null,
      name_en: s.name_en,
      image_url: s.image_url ?? null,
      temp_min: s.temp_min,
      temp_max: s.temp_max,
      ph_min: s.ph_min,
      ph_max: s.ph_max,
      size_max: s.size_max,
      is_schooling: s.is_schooling,
      min_school_size: s.min_school_size ?? 1,
    }));
  }
}
