import { WaterQualityEngine } from '../water-quality.engine';
import { WaterParameter } from '@accessors/aquarium/entities/water-parameter.entity';
import { FishSpecies } from '@accessors/livestock/entities/fish-species.entity';

describe('WaterQualityEngine', () => {
  let engine: WaterQualityEngine;

  beforeEach(() => {
    engine = new WaterQualityEngine();
  });

  // Helpers
  const createParams = (
    overrides: Partial<{
      ammonia: number;
      nitrite: number;
      nitrate: number;
      ph: number;
      temperature: number;
      tested_at: Date;
    }> = {},
  ): WaterParameter => {
    const params = new WaterParameter();
    params.fill({
      ammonia: overrides.ammonia ?? 0,
      nitrite: overrides.nitrite ?? 0,
      nitrate: overrides.nitrate ?? 10,
      ph: overrides.ph ?? 7.0,
      temperature: overrides.temperature ?? 25,
      tested_at: overrides.tested_at ?? new Date(),
    } as any);
    return params;
  };

  const createSpecies = (
    tempMin: number,
    tempMax: number,
    phMin: number,
    phMax: number,
    name: string = 'Test Fish',
  ): FishSpecies => {
    const species = new FishSpecies();
    species.fill({
      name_en: name,
      temp_min: tempMin,
      temp_max: tempMax,
      ph_min: phMin,
      ph_max: phMax,
    } as any);
    return species;
  };

  describe('analyzeWaterHealth', () => {
    it('should return excellent score for perfect water', () => {
      const params = createParams({ ammonia: 0, nitrite: 0, nitrate: 10 });

      const result = engine.analyzeWaterHealth(params);

      expect(result.score).toBe(100);
      expect(result.status).toBe('excellent');
      expect(result.issues).toHaveLength(0);
    });

    it('should detect dangerous ammonia levels', () => {
      const params = createParams({ ammonia: 0.5 });

      const result = engine.analyzeWaterHealth(params);

      expect(result.status).toBe('warning'); // 100 - 40 = 60 = warning
      expect(result.issues.some((i) => i.includes('ammonia'))).toBe(true);
      expect(
        result.recommendations.some((r) => r.includes('water change')),
      ).toBe(true);
    });

    it('should detect dangerous nitrite levels', () => {
      const params = createParams({ nitrite: 0.5 });

      const result = engine.analyzeWaterHealth(params);

      expect(result.score).toBeLessThan(70);
      expect(result.issues.some((i) => i.includes('nitrite'))).toBe(true);
    });

    it('should warn about high nitrate levels', () => {
      const params = createParams({ nitrate: 50 });

      const result = engine.analyzeWaterHealth(params);

      expect(result.status).toBe('excellent'); // 100 - 10 = 90
      expect(result.issues.some((i) => i.includes('nitrate'))).toBe(true);
    });

    it('should check pH against species requirements', () => {
      const params = createParams({ ph: 8.0 });
      const species = [createSpecies(22, 28, 6.0, 7.0, 'Discus')];

      const result = engine.analyzeWaterHealth(params, species);

      expect(
        result.issues.some((i) => i.includes('pH') && i.includes('Discus')),
      ).toBe(true);
    });

    it('should check temperature against species requirements', () => {
      const params = createParams({ temperature: 30 });
      const species = [createSpecies(18, 24, 6.5, 7.5, 'Goldfish')];

      const result = engine.analyzeWaterHealth(params, species);

      expect(
        result.issues.some(
          (i) => i.includes('Temperature') && i.includes('Goldfish'),
        ),
      ).toBe(true);
    });
  });

  describe('checkAllParameters', () => {
    it('should return status for all parameters', () => {
      const params = createParams({
        ammonia: 0.25,
        nitrite: 0,
        nitrate: 20,
        ph: 7.0,
        temperature: 25,
      });

      const result = engine.checkAllParameters(params);

      expect(result.length).toBe(5);
      expect(result.find((r) => r.parameter === 'ammonia')?.status).toBe(
        'warning',
      );
      expect(result.find((r) => r.parameter === 'nitrite')?.status).toBe('ok');
    });

    it('should handle null values gracefully', () => {
      const params = new WaterParameter();
      params.fill({} as any);

      const result = engine.checkAllParameters(params);

      result.forEach((check) => {
        expect(check.status).toBe('ok');
      });
    });
  });

  describe('predictNextWaterChange', () => {
    it('should return default schedule with insufficient data', () => {
      const params = [createParams()];

      const result = engine.predictNextWaterChange(params, 100);

      expect(result.daysUntilNeeded).toBe(7);
      expect(result.urgency).toBe('low');
    });

    it('should predict based on nitrate accumulation rate', () => {
      const day1 = createParams({
        nitrate: 10,
        tested_at: new Date('2024-01-01'),
      });
      const day7 = createParams({
        nitrate: 30,
        tested_at: new Date('2024-01-07'),
      });

      const result = engine.predictNextWaterChange([day1, day7], 100);

      // Rate: (30-10) / 6 days = 3.33 ppm/day
      expect(result.daysUntilNeeded).toBeGreaterThan(0);
      expect(result.reason).toContain('ppm/day');
    });

    it('should return low urgency when nitrate is decreasing', () => {
      const day1 = createParams({
        nitrate: 30,
        tested_at: new Date('2024-01-01'),
      });
      const day7 = createParams({
        nitrate: 20,
        tested_at: new Date('2024-01-07'),
      });

      const result = engine.predictNextWaterChange([day1, day7], 100);

      expect(result.urgency).toBe('low');
      expect(result.daysUntilNeeded).toBe(14);
    });

    it('should return high urgency when nearing danger threshold', () => {
      const day1 = createParams({
        nitrate: 60,
        tested_at: new Date('2024-01-01'),
      });
      const day2 = createParams({
        nitrate: 70,
        tested_at: new Date('2024-01-02'),
      });

      const result = engine.predictNextWaterChange([day1, day2], 100);

      expect(result.urgency).toBe('high');
    });
  });
});
