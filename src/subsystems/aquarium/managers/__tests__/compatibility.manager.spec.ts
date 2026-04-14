import { CompatibilityManager } from '../compatibility.manager';
import { CompatibilityEngine } from '../../engines/compatibility.engine';
import { BioloadEngine } from '../../engines/bioload.engine';

describe('CompatibilityManager', () => {
  let manager: CompatibilityManager;
  let mockFishSpeciesAccessor: any;
  let mockOverrideAccessor: any;

  beforeEach(() => {
    mockFishSpeciesAccessor = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    mockOverrideAccessor = {
      findBySpeciesSet: jest.fn().mockResolvedValue([]),
    };

    manager = new CompatibilityManager(
      mockFishSpeciesAccessor,
      mockOverrideAccessor,
      new CompatibilityEngine(),
      new BioloadEngine(),
    );
  });

  describe('checkCompatibility', () => {
    it('should reject empty species array', async () => {
      await expect(
        manager.checkCompatibility({ tank_size_liters: 60, species: [] }),
      ).rejects.toThrow('At least 1 species required');
    });

    it('should reject tank_size_liters <= 0', async () => {
      await expect(
        manager.checkCompatibility({
          tank_size_liters: 0,
          species: [{ id: 1, quantity: 1 }],
        }),
      ).rejects.toThrow('Tank size must be positive');
    });

    it('should reject > 20 species', async () => {
      const species = Array.from({ length: 21 }, (_, i) => ({
        id: i + 1,
        quantity: 1,
      }));
      await expect(
        manager.checkCompatibility({ tank_size_liters: 200, species }),
      ).rejects.toThrow('Maximum 20 species per check');
    });

    it('should reject unknown species ID', async () => {
      mockFishSpeciesAccessor.findById.mockResolvedValue(null);
      await expect(
        manager.checkCompatibility({
          tank_size_liters: 60,
          species: [{ id: 999, quantity: 1 }],
        }),
      ).rejects.toThrow('Unknown species: 999');
    });

    it('should return compatible result for compatible species', async () => {
      const guppy = {
        id: 1, name_en: 'Guppy', name_vn: 'Cá bảy màu',
        temperament: 'PEACEFUL', temp_min: 22, temp_max: 28,
        ph_min: 6.5, ph_max: 8, size_max: 5, bioload_level: 3,
        is_schooling: false, min_school_size: 1,
      };
      const platy = {
        id: 2, name_en: 'Platy', name_vn: 'Cá mún',
        temperament: 'PEACEFUL', temp_min: 20, temp_max: 28,
        ph_min: 7, ph_max: 8, size_max: 6, bioload_level: 3,
        is_schooling: false, min_school_size: 1,
      };

      mockFishSpeciesAccessor.findById
        .mockResolvedValueOnce(guppy)
        .mockResolvedValueOnce(platy);

      const result = await manager.checkCompatibility({
        tank_size_liters: 60,
        species: [
          { id: 1, quantity: 6 },
          { id: 2, quantity: 4 },
        ],
      });

      expect(result.overall_verdict).toBe('compatible');
      expect(result.stocking_percent).toBeGreaterThan(0);
      expect(result.pairs).toHaveLength(1);
      expect(result.pairs[0].verdict).toBe('compatible');
    });

    it('should use override when available', async () => {
      const betta = {
        id: 1, name_en: 'Betta', name_vn: 'Cá chọi',
        temperament: 'AGGRESSIVE', temp_min: 24, temp_max: 30,
        ph_min: 6, ph_max: 7.5, size_max: 7, bioload_level: 3,
        is_schooling: false, min_school_size: 1,
      };
      const guppy = {
        id: 2, name_en: 'Guppy', name_vn: 'Cá bảy màu',
        temperament: 'PEACEFUL', temp_min: 22, temp_max: 28,
        ph_min: 6.5, ph_max: 8, size_max: 5, bioload_level: 3,
        is_schooling: false, min_school_size: 1,
      };

      mockFishSpeciesAccessor.findById
        .mockResolvedValueOnce(betta)
        .mockResolvedValueOnce(guppy);

      mockOverrideAccessor.findBySpeciesSet.mockResolvedValue([
        {
          species_a_id: 1, species_b_id: 2,
          verdict: 'incompatible',
          reason_vn: 'Cá chọi sẽ tấn công cá bảy màu',
          reason_en: 'Betta will attack guppy fins',
        },
      ]);

      const result = await manager.checkCompatibility({
        tank_size_liters: 40,
        species: [
          { id: 1, quantity: 1 },
          { id: 2, quantity: 6 },
        ],
      });

      expect(result.overall_verdict).toBe('incompatible');
      expect(result.pairs[0].verdict).toBe('incompatible');
      expect(result.pairs[0].reasons_vn[0]).toContain('tấn công');
    });

    it('should include schooling warnings', async () => {
      const tetra = {
        id: 1, name_en: 'Neon Tetra', name_vn: 'Cá neon',
        temperament: 'PEACEFUL', temp_min: 22, temp_max: 28,
        ph_min: 6, ph_max: 7.5, size_max: 4, bioload_level: 2,
        is_schooling: true, min_school_size: 6,
      };

      mockFishSpeciesAccessor.findById.mockResolvedValue(tetra);

      const result = await manager.checkCompatibility({
        tank_size_liters: 60,
        species: [{ id: 1, quantity: 2 }],
      });

      expect(result.warnings.some((w) => w.includes('6'))).toBe(true);
    });
  });

  describe('getSpeciesList', () => {
    it('should return mapped species list', async () => {
      mockFishSpeciesAccessor.findAll.mockResolvedValue([
        {
          id: 1, name_en: 'Guppy', name_vn: 'Cá bảy màu',
          scientific_name: 'Poecilia reticulata', image_url: null,
          temp_min: 22, temp_max: 28, ph_min: 6.5, ph_max: 8,
          size_max: 5, is_schooling: false, min_school_size: 1,
        },
      ]);

      const result = await manager.getSpeciesList();
      expect(result).toHaveLength(1);
      expect(result[0].name_vn).toBe('Cá bảy màu');
      expect(result[0].name_scientific).toBe('Poecilia reticulata');
    });
  });
});
