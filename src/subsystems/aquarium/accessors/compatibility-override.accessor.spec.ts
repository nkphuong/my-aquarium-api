import { CompatibilityOverrideAccessor } from './compatibility-override.accessor';

describe('CompatibilityOverrideAccessor', () => {
  let accessor: CompatibilityOverrideAccessor;
  let mockEm: any;

  beforeEach(() => {
    mockEm = { find: jest.fn(), findOne: jest.fn() };
    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };
    accessor = new CompatibilityOverrideAccessor(mockEm, mockLogger as any);
  });

  describe('findBySpeciesSet', () => {
    it('should return empty array for empty species set', async () => {
      const result = await accessor.findBySpeciesSet([]);
      expect(result).toEqual([]);
      expect(mockEm.find).not.toHaveBeenCalled();
    });

    it('should query with species IDs', async () => {
      mockEm.find.mockResolvedValue([]);
      await accessor.findBySpeciesSet([1, 2, 3]);
      expect(mockEm.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByPair', () => {
    it('should query both directions', async () => {
      mockEm.findOne.mockResolvedValue(null);
      await accessor.findByPair(1, 2);
      expect(mockEm.findOne).toHaveBeenCalledTimes(1);
      const where = mockEm.findOne.mock.calls[0][1];
      expect(where.$or).toHaveLength(2);
    });
  });
});
