import { BioloadEngine } from './bioload.engine';
import type { FishSpecies } from '../entities/fish-species.entity';

describe('BioloadEngine', () => {
  let engine: BioloadEngine;
  beforeEach(() => { engine = new BioloadEngine(); });

  const makeSpecies = (overrides: Partial<FishSpecies> = {}): FishSpecies => ({
    bioload_level: 5, size_max: 5, ...overrides,
  } as FishSpecies);

  describe('calculateStockingPercent', () => {
    it('should return ok for light stocking', () => {
      const result = engine.calculateStockingPercent(60, [
        { species: makeSpecies({ bioload_level: 3, size_max: 5 }), quantity: 6 },
      ]);
      expect(result.percent).toBeGreaterThan(0);
      expect(result.percent).toBeLessThan(80);
      expect(result.verdict).toBe('ok');
    });

    it('should return overstocked at 100%+', () => {
      const result = engine.calculateStockingPercent(10, [
        { species: makeSpecies({ bioload_level: 10, size_max: 15 }), quantity: 10 },
      ]);
      expect(result.verdict).toBe('overstocked');
      expect(result.percent).toBeGreaterThanOrEqual(100);
    });

    it('should return 0% for empty list', () => {
      const result = engine.calculateStockingPercent(60, []);
      expect(result.percent).toBe(0);
      expect(result.verdict).toBe('ok');
    });

    it('should handle zero tank size', () => {
      const result = engine.calculateStockingPercent(0, [
        { species: makeSpecies(), quantity: 1 },
      ]);
      expect(result.percent).toBe(0);
    });
  });
});
