import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { WaterParameterAccessor } from '../water-parameter.accessor';

describe('WaterParameterAccessor', () => {
  let accessor: WaterParameterAccessor;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const mockEntityManager = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaterParameterAccessor,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    accessor = module.get<WaterParameterAccessor>(WaterParameterAccessor);
  });

  describe('findByTankId', () => {
    it('should return all water parameters for a specific tank ordered by tested_at DESC', async () => {
      const mockParams = [{ id: 1, tank_id: 1 }];
      mockRepository.find.mockResolvedValue(mockParams);

      const result = await accessor.findByTankId(1);

      expect(mockRepository.find).toHaveBeenCalledWith(
        { tank_id: 1 },
        { orderBy: { tested_at: 'DESC' } },
      );
      expect(result).toEqual(mockParams);
    });
  });

  describe('findLatestByTankId', () => {
    it('should return the latest water parameter for a specific tank', async () => {
      const mockParam = { id: 1, tank_id: 1 };
      mockRepository.findOne.mockResolvedValue(mockParam);

      const result = await accessor.findLatestByTankId(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith(
        { tank_id: 1 },
        { orderBy: { tested_at: 'DESC' } },
      );
      expect(result).toEqual(mockParam);
    });

    it('should return null if no parameters exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await accessor.findLatestByTankId(1);

      expect(result).toBeNull();
    });
  });
});
