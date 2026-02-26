import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { FishSpeciesAccessor } from '../fish-species.accessor';
import { FishSpecies } from '../../entities/fish-species.entity';

jest.mock('@mikro-orm/core', () => {
  const original = jest.requireActual('@mikro-orm/core');
  return {
    ...original,
    wrap: jest.fn().mockReturnValue({ assign: jest.fn() }),
  };
});

describe('FishSpeciesAccessor', () => {
  let accessor: FishSpeciesAccessor;
  let mockRepository: any;
  let mockEntityManager: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockEntityManager = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      assign: jest.fn(),
      flush: jest.fn(),
      persistAndFlush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FishSpeciesAccessor,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    accessor = module.get<FishSpeciesAccessor>(FishSpeciesAccessor);
  });

  describe('findAll', () => {
    it('should return all species unconditionally when no keyword is provided', async () => {
      const mockSpeciesList = [{ id: 1, name_en: 'Betta' }];
      mockRepository.find.mockResolvedValue(mockSpeciesList);

      const result = await accessor.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith(
        {},
        { orderBy: { name_en: 'asc' } },
      );
      expect(result).toEqual(mockSpeciesList);
    });

    it('should use ILIKE querying logic when keyword is provided', async () => {
      mockRepository.find.mockResolvedValue([]);

      await accessor.findAll('Betta');

      expect(mockRepository.find).toHaveBeenCalledWith(
        {
          $or: [
            { name_en: { $ilike: '%Betta%' } },
            { name_vn: { $ilike: '%Betta%' } },
            { scientific_name: { $ilike: '%Betta%' } },
            { aliases: { $contains: ['Betta'] } },
          ],
        },
        { orderBy: { name_en: 'asc' } },
      );
    });
  });

  describe('save', () => {
    it('should update existing entity if it declares exists', async () => {
      const mockEntity = { id: 1, exists: true } as any;
      mockRepository.findOneOrFail = jest.fn().mockResolvedValue({ id: 1 });

      // Inherited update method requires findOneOrFail
      await accessor.save(mockEntity);
      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({ id: 1 });
      expect(mockEntityManager.flush).toHaveBeenCalled();
    });

    it('should update entity if exists by name_en matching', async () => {
      const mockEntity = {
        id: undefined,
        name_en: 'Betta',
        toJSON: () => ({ name_en: 'Betta' }),
      } as any;
      const existingInDb = { id: 1, name_en: 'Betta' };

      mockRepository.findOne.mockResolvedValue(existingInDb);

      const result = await accessor.save(mockEntity);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ name_en: 'Betta' });
      expect(mockEntityManager.assign).toHaveBeenCalledWith(existingInDb, {
        name_en: 'Betta',
      });
      expect(mockEntityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(existingInDb);
    });

    it('should perform create if entity does not exist', async () => {
      const mockEntity = {
        id: undefined,
        name_en: 'Neon Tetra',
        toJSON: () => ({ name_en: 'Neon Tetra' }),
      } as any;
      mockRepository.findOne.mockResolvedValue(null);

      const result = await accessor.save(mockEntity);

      expect(mockEntityManager.persistAndFlush).toHaveBeenCalledWith(
        mockEntity,
      );
      expect(result).toEqual(mockEntity);
    });
  });
});
