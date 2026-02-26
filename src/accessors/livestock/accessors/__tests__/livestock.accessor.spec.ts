import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { LivestockAccessor } from '../livestock.accessor';

describe('LivestockAccessor', () => {
  let accessor: LivestockAccessor;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
    };

    const mockEntityManager = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LivestockAccessor,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    accessor = module.get<LivestockAccessor>(LivestockAccessor);
  });

  describe('findByTankId', () => {
    it('should return livestock in a specific tank ordered by createdAt', async () => {
      const mockLivestock = [{ id: 1, tank_id: 1 }];
      mockRepository.find.mockResolvedValue(mockLivestock);

      const result = await accessor.findByTankId(1);

      expect(mockRepository.find).toHaveBeenCalledWith(
        { tank_id: 1 },
        { orderBy: { createdAt: 'DESC' } },
      );
      expect(result).toEqual(mockLivestock);
    });
  });
});
