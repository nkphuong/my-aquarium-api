import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';
import { UserAccessor } from '../user.accessor';
import { EntityNotFoundException } from '@core/exceptions/domain.exception';

describe('UserAccessor', () => {
  let accessor: UserAccessor;
  let mockRepository: any;
  let mockEntityManager: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
    };

    mockEntityManager = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
      flush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAccessor,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    accessor = module.get<UserAccessor>(UserAccessor);
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await accessor.findByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateRefreshToken', () => {
    it('should update refresh token and flush', async () => {
      const mockUser = {
        id: 1,
        updateRefreshToken: jest.fn(),
      };

      // We mock the inherited findByIdOrFail internally instead of creating complex prototypes
      jest.spyOn(accessor, 'findByIdOrFail').mockResolvedValue(mockUser as any);

      const result = await accessor.updateRefreshToken(1, 'hashed_token');

      expect(accessor.findByIdOrFail).toHaveBeenCalledWith(1);
      expect(mockUser.updateRefreshToken).toHaveBeenCalledWith('hashed_token');
      expect(mockEntityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });
});
