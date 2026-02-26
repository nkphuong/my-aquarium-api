import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { TankAccessor } from '../tank.accessor';
import { Tank } from '../../entities/tank.entity';

describe('TankAccessor', () => {
  let accessor: TankAccessor;
  let mockRepository: any;
  let mockEntityManager: any;

  beforeEach(async () => {
    mockRepository = {
      findAndCount: jest.fn(),
      find: jest.fn(),
    };

    mockEntityManager = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TankAccessor,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    accessor = module.get<TankAccessor>(TankAccessor);
  });

  describe('findAll', () => {
    it('should return paginated tanks without archived by default', async () => {
      const mockTanks = [{ id: 1 }, { id: 2 }];
      mockRepository.findAndCount.mockResolvedValue([mockTanks, 2]);

      const result = await accessor.findAll(1, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        { is_archived: false },
        { limit: 10, offset: 0, orderBy: { createdAt: 'DESC' } },
      );
      expect(result.data).toEqual(mockTanks);
      expect(result.meta.total).toBe(2);
      expect(result.meta.lastPage).toBe(1);
    });

    it('should include archived when specified', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await accessor.findAll(2, 5, true);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        {},
        { limit: 5, offset: 5, orderBy: { createdAt: 'DESC' } },
      );
    });
  });

  describe('findByUserId', () => {
    it('should return tanks for a specific user', async () => {
      const mockTanks = [{ id: 1, user_id: 1 }];
      mockRepository.find.mockResolvedValue(mockTanks);

      const result = await accessor.findByUserId(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        user_id: 1,
        is_archived: false,
      });
      expect(result).toEqual(mockTanks);
    });

    it('should include archived tanks for user when specified', async () => {
      await accessor.findByUserId(2, true);

      expect(mockRepository.find).toHaveBeenCalledWith({ user_id: 2 });
    });
  });
});
