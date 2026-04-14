import { CompatibilityEngine } from '../compatibility.engine';
import { Fish } from '@entities/fish.entity';
import { FishSpecies } from '@entities/fish-species.entity';

describe('CompatibilityEngine', () => {
  let engine: CompatibilityEngine;

  beforeEach(() => {
    engine = new CompatibilityEngine();
  });

  // Helpers
  const createSpecies = (
    id: number,
    name: string,
    tempMin: number,
    tempMax: number,
    phMin: number,
    phMax: number,
    sizeMax: number = 10,
  ): FishSpecies => {
    const species = new FishSpecies();
    species.fill({
      id,
      name_en: name,
      temp_min: tempMin,
      temp_max: tempMax,
      ph_min: phMin,
      ph_max: phMax,
      size_max: sizeMax,
    } as any);
    return species;
  };

  const createFish = (speciesName: string): Fish => {
    const fish = new Fish();
    fish.fill({ species: speciesName } as any);
    return fish;
  };

  describe('areSpeciesCompatible', () => {
    it('should return compatible when all parameters overlap', () => {
      const species1 = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5, 4);
      const species2 = createSpecies(2, 'Cardinal Tetra', 23, 27, 6.5, 7.0, 5);

      const result = engine.areSpeciesCompatible(species1, species2);

      expect(result.compatible).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.issues).toHaveLength(0);
    });

    it('should be incompatible when temperature ranges do not overlap', () => {
      const tropical = createSpecies(1, 'Discus', 26, 30, 6.0, 7.0);
      const coldwater = createSpecies(2, 'Goldfish', 10, 23, 6.5, 7.5);

      const result = engine.areSpeciesCompatible(tropical, coldwater);

      expect(result.compatible).toBe(false);
      expect(result.score).toBe(0);
      expect(result.issues[0]).toContain('Temperature incompatible');
    });

    it('should be incompatible when pH ranges do not overlap', () => {
      const acidLover = createSpecies(1, 'Discus', 26, 30, 5.5, 6.5);
      const alkalineLover = createSpecies(
        2,
        'Rift Lake Cichlid',
        24,
        28,
        7.5,
        8.5,
      );

      const result = engine.areSpeciesCompatible(acidLover, alkalineLover);

      expect(result.compatible).toBe(false);
      expect(result.issues[0]).toContain('pH incompatible');
    });

    it('should warn about large size ratio (>3:1)', () => {
      const smallFish = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5, 3);
      const largeFish = createSpecies(2, 'Oscar', 22, 28, 6.0, 7.5, 35);

      const result = engine.areSpeciesCompatible(smallFish, largeFish);

      expect(result.compatible).toBe(true); // Still compatible water-wise
      expect(result.warnings.some((w) => w.includes('Size ratio'))).toBe(true);
      expect(result.score).toBeLessThan(80);
    });

    it('should warn about limited parameter overlap', () => {
      const species1 = createSpecies(1, 'Fish A', 20, 24, 6.5, 7.0);
      const species2 = createSpecies(2, 'Fish B', 23, 28, 6.8, 7.5);

      const result = engine.areSpeciesCompatible(species1, species2);

      expect(result.compatible).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should penalize peaceful + aggressive temperament', () => {
      const peaceful = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5, 4);
      peaceful.fill({ temperament: 'PEACEFUL' } as any);
      const aggressive = createSpecies(2, 'Red Devil', 22, 28, 6.0, 7.5, 15);
      aggressive.fill({ temperament: 'AGGRESSIVE' } as any);

      const result = engine.areSpeciesCompatible(peaceful, aggressive);

      expect(result.score).toBeLessThan(40);
      expect(result.issues.some((i) => i.includes('Aggression mismatch'))).toBe(true);
    });

    it('should warn for peaceful + semi-aggressive temperament', () => {
      const peaceful = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5, 4);
      peaceful.fill({ temperament: 'PEACEFUL' } as any);
      const semi = createSpecies(2, 'Tiger Barb', 22, 28, 6.0, 7.5, 7);
      semi.fill({ temperament: 'SEMI_AGGRESSIVE' } as any);

      const result = engine.areSpeciesCompatible(peaceful, semi);

      expect(result.warnings.some((w) => w.includes('bully'))).toBe(true);
      expect(result.score).toBeLessThan(100);
    });

    it('should not penalize same temperament', () => {
      const fish1 = createSpecies(1, 'Guppy', 22, 28, 6.5, 8.0, 5);
      fish1.fill({ temperament: 'PEACEFUL' } as any);
      const fish2 = createSpecies(2, 'Platy', 20, 28, 7.0, 8.0, 6);
      fish2.fill({ temperament: 'PEACEFUL' } as any);

      const result = engine.areSpeciesCompatible(fish1, fish2);

      expect(result.issues.filter((i) => i.includes('Aggression'))).toHaveLength(0);
    });
  });

  describe('checkSchoolingRequirements', () => {
    it('should warn if schooling fish has too few', () => {
      const tetra = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5, 4);
      tetra.fill({ is_schooling: true, min_school_size: 6, name_vn: 'Cá neon' } as any);

      const warnings = engine.checkSchoolingRequirements([
        { species: tetra, quantity: 2 },
      ]);

      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toContain('6');
      expect(warnings[0]).toContain('2');
    });

    it('should not warn if schooling fish meets minimum', () => {
      const tetra = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5, 4);
      tetra.fill({ is_schooling: true, min_school_size: 6 } as any);

      const warnings = engine.checkSchoolingRequirements([
        { species: tetra, quantity: 8 },
      ]);

      expect(warnings).toHaveLength(0);
    });

    it('should not warn for non-schooling fish', () => {
      const betta = createSpecies(1, 'Betta', 24, 30, 6.0, 7.5, 7);
      betta.fill({ is_schooling: false } as any);

      const warnings = engine.checkSchoolingRequirements([
        { species: betta, quantity: 1 },
      ]);

      expect(warnings).toHaveLength(0);
    });
  });

  describe('validateNewFishCompatibility', () => {
    it('should allow adding compatible species', () => {
      const neonTetra = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5, 4);
      const cardinalTetra = createSpecies(
        2,
        'Cardinal Tetra',
        23,
        27,
        6.0,
        7.5,
        5,
      );
      const existingFish = [createFish('Neon Tetra'), createFish('Neon Tetra')];
      const speciesMap = new Map([
        ['Neon Tetra', neonTetra],
        ['Cardinal Tetra', cardinalTetra],
      ]);

      const result = engine.validateNewFishCompatibility(
        cardinalTetra,
        existingFish,
        speciesMap,
      );

      expect(result.canAdd).toBe(true);
      expect(result.incompatibilities).toHaveLength(0);
    });

    it('should reject adding incompatible species', () => {
      const tropical = createSpecies(1, 'Discus', 26, 30, 6.0, 7.0);
      const coldwater = createSpecies(2, 'Goldfish', 10, 23, 6.5, 7.5);
      const existingFish = [createFish('Discus')];
      const speciesMap = new Map([
        ['Discus', tropical],
        ['Goldfish', coldwater],
      ]);

      const result = engine.validateNewFishCompatibility(
        coldwater,
        existingFish,
        speciesMap,
      );

      expect(result.canAdd).toBe(false);
      expect(result.incompatibilities.length).toBeGreaterThan(0);
    });

    it('should allow adding same species (skip self-check)', () => {
      const neonTetra = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5, 4);
      const existingFish = [createFish('Neon Tetra'), createFish('Neon Tetra')];
      const speciesMap = new Map([['Neon Tetra', neonTetra]]);

      const result = engine.validateNewFishCompatibility(
        neonTetra,
        existingFish,
        speciesMap,
      );

      expect(result.canAdd).toBe(true);
      expect(result.overallScore).toBe(100);
    });

    it('should return 100 score for empty tank', () => {
      const species = createSpecies(1, 'Neon Tetra', 22, 28, 6.0, 7.5);
      const speciesMap = new Map([['Neon Tetra', species]]);

      const result = engine.validateNewFishCompatibility(
        species,
        [],
        speciesMap,
      );

      expect(result.canAdd).toBe(true);
      expect(result.overallScore).toBe(100);
    });
  });

  describe('getOptimalParameters', () => {
    it('should return optimal overlapping range for compatible species', () => {
      const species1 = createSpecies(1, 'Fish A', 22, 28, 6.5, 7.5);
      const species2 = createSpecies(2, 'Fish B', 24, 26, 6.8, 7.2);

      const result = engine.getOptimalParameters([species1, species2]);

      expect(result).toEqual({
        temp: { min: 24, max: 26 },
        ph: { min: 6.8, max: 7.2 },
      });
    });

    it('should return null when no overlapping range exists', () => {
      const tropical = createSpecies(1, 'Tropical', 26, 30, 6.0, 7.0);
      const coldwater = createSpecies(2, 'Coldwater', 10, 20, 7.0, 8.0);

      const result = engine.getOptimalParameters([tropical, coldwater]);

      expect(result).toBeNull();
    });

    it('should return null for empty species list', () => {
      const result = engine.getOptimalParameters([]);

      expect(result).toBeNull();
    });

    it('should return single species parameters when only one species', () => {
      const species = createSpecies(1, 'Fish', 22, 28, 6.5, 7.5);

      const result = engine.getOptimalParameters([species]);

      expect(result).toEqual({
        temp: { min: 22, max: 28 },
        ph: { min: 6.5, max: 7.5 },
      });
    });
  });
});
