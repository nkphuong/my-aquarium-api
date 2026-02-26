import { BioloadEngine, BioloadValidation } from '../bioload.engine';
import { Fish } from '@accessors/livestock/entities/fish.entity';
import { FishSpecies } from '@accessors/livestock/entities/fish-species.entity';
import { Tank } from '@accessors/aquarium/entities/tank.entity';

describe('BioloadEngine', () => {
  let engine: BioloadEngine;

  beforeEach(() => {
    engine = new BioloadEngine();
  });

  // Helper to create mock entities
  const createMockTank = (volumeLiters: number): Tank => {
    const tank = new Tank();
    tank.fill({ volume_liters: volumeLiters } as any);
    return tank;
  };

  const createMockSpecies = (
    bioloadLevel: number,
    sizeMax: number,
    name = 'Test Fish',
  ): FishSpecies => {
    const species = new FishSpecies();
    species.fill({
      name_en: name,
      bioload_level: bioloadLevel,
      size_max: sizeMax,
    } as any);
    return species;
  };

  const createMockFish = (speciesName: string): Fish => {
    const fish = new Fish();
    fish.fill({ species: speciesName } as any);
    return fish;
  };

  describe('calculateFishBioload', () => {
    it('should calculate bioload based on species data', () => {
      const species = createMockSpecies(5, 10); // bioload_level=5, size_max=10cm

      const result = engine.calculateFishBioload(species);

      // Formula: bioload_level * (size_max / 10) = 5 * 1 = 5
      expect(result).toBe(5);
    });

    it('should handle high bioload fish like goldfish', () => {
      const goldfish = createMockSpecies(10, 15); // high bioload, 15cm max

      const result = engine.calculateFishBioload(goldfish);

      // 10 * (15/10) = 10 * 1.5 = 15
      expect(result).toBe(15);
    });

    it('should handle low bioload fish like shrimp', () => {
      const shrimp = createMockSpecies(1, 3); // very low bioload, 3cm

      const result = engine.calculateFishBioload(shrimp);

      // 1 * (3/10) = 0.3
      expect(result).toBe(0.3);
    });

    it('should use defaults for missing values', () => {
      const species = new FishSpecies();
      species.fill({} as any);

      const result = engine.calculateFishBioload(species);

      // Default: 5 * (10/10) = 5
      expect(result).toBe(5);
    });
  });

  describe('calculateMaxBioload', () => {
    it('should calculate max bioload based on tank volume', () => {
      const tank = createMockTank(100); // 100 liters

      const result = engine.calculateMaxBioload(tank);

      // 100 / 4 = 25 bioload units
      expect(result).toBe(25);
    });

    it('should return 0 for tank without volume', () => {
      const tank = new Tank();

      const result = engine.calculateMaxBioload(tank);

      expect(result).toBe(0);
    });
  });

  describe('validateTankCapacity', () => {
    it('should allow adding fish when capacity is available', () => {
      const tank = createMockTank(100); // max bioload = 25
      const species = createMockSpecies(5, 10, 'Test Fish'); // bioload = 5
      const speciesMap = new Map([['Test Fish', species]]);

      const result = engine.validateTankCapacity(tank, [], species, speciesMap);

      expect(result.canAdd).toBe(true);
      expect(result.current).toBe(0);
      expect(result.newLoad).toBe(5);
      expect(result.max).toBe(25);
    });

    it('should reject adding fish when capacity would be exceeded', () => {
      const tank = createMockTank(20); // max bioload = 5
      const highBioloadSpecies = createMockSpecies(10, 10, 'Goldfish'); // bioload = 10
      const speciesMap = new Map([['Goldfish', highBioloadSpecies]]);

      const result = engine.validateTankCapacity(
        tank,
        [],
        highBioloadSpecies,
        speciesMap,
      );

      expect(result.canAdd).toBe(false);
      expect(result.reason).toContain('exceed tank capacity');
    });

    it('should consider existing fish in capacity calculation', () => {
      const tank = createMockTank(40); // max bioload = 10
      const species = createMockSpecies(5, 10, 'Test Fish'); // bioload = 5 each
      const existingFish = [createMockFish('Test Fish')];
      const speciesMap = new Map([['Test Fish', species]]);

      // First fish uses 5, adding another would make 10 (at limit)
      const result = engine.validateTankCapacity(
        tank,
        existingFish,
        species,
        speciesMap,
      );

      expect(result.canAdd).toBe(true);
      expect(result.current).toBe(5);
      expect(result.utilizationPercent).toBe(100);
    });
  });

  describe('assessBioloadHealth', () => {
    it('should return "low" when utilization is under 50%', () => {
      const tank = createMockTank(100); // max 25
      const species = createMockSpecies(5, 10, 'Test Fish'); // bioload 5
      const fish = [createMockFish('Test Fish')]; // total 5 = 20%
      const speciesMap = new Map([['Test Fish', species]]);

      const result = engine.assessBioloadHealth(tank, fish, speciesMap);

      expect(result.status).toBe('low');
      expect(result.percent).toBe(20);
    });

    it('should return "optimal" when utilization is 50-75%', () => {
      const tank = createMockTank(40); // max 10
      const species = createMockSpecies(5, 10, 'Test Fish'); // bioload 5
      const fish = [createMockFish('Test Fish')]; // total 5 = 50%
      const speciesMap = new Map([['Test Fish', species]]);

      const result = engine.assessBioloadHealth(tank, fish, speciesMap);

      expect(result.status).toBe('optimal');
    });

    it('should return "critical" when over 100%', () => {
      const tank = createMockTank(20); // max 5
      const species = createMockSpecies(5, 10, 'Test Fish'); // bioload 5 each
      const fish = [createMockFish('Test Fish'), createMockFish('Test Fish')]; // total 10 = 200%
      const speciesMap = new Map([['Test Fish', species]]);

      const result = engine.assessBioloadHealth(tank, fish, speciesMap);

      expect(result.status).toBe('critical');
      expect(result.percent).toBe(200);
    });
  });
});
