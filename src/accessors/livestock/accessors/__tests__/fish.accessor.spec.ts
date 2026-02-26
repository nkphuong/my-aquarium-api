import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { FishAccessor } from '../fish.accessor';

describe('FishAccessor', () => {
  let accessor: FishAccessor;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      find: jest.fn(),
    };

    const mockEntityManager = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FishAccessor,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    accessor = module.get<FishAccessor>(FishAccessor);
  });

  describe('findAll', () => {
    it('should return all fish', async () => {
      const mockFish = [{ id: 1 }, { id: 2 }];
      mockRepository.findAll.mockResolvedValue(mockFish);

      const result = await accessor.findAll();

      expect(mockRepository.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(mockFish);
    });
  });

  describe('findBySpecies', () => {
    it('should return fish of a specific species', async () => {
      const mockFish = [{ id: 1, species: 'Betta' }];
      mockRepository.find.mockResolvedValue(mockFish);

      const result = await accessor.findBySpecies('Betta');

      expect(mockRepository.find).toHaveBeenCalledWith({ species: 'Betta' });
      expect(result).toEqual(mockFish);
    });
  });

  describe('findByTankId', () => {
    it('should return fish in a specific tank', async () => {
      const mockFish = [{ id: 1, tank_id: 1 }];
      mockRepository.find.mockResolvedValue(mockFish);

      const result = await accessor.findByTankId(1);

      expect(mockRepository.find).toHaveBeenCalledWith({ tank_id: 1 });
      expect(result).toEqual(mockFish);
    });
  });
});
