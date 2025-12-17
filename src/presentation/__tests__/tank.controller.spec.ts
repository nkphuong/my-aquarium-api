import { Test, TestingModule } from '@nestjs/testing';
import { TankController } from '../controllers/tank.controller';
import { TankService } from '@application/services/tank.service';
import { TankDto } from '@application/dtos/tank.dto';
import { PaginatedResult, PaginationMeta } from '@application/dtos/pagination.dto';

// Mock the JwtAuthGuard at the module level to avoid import chain issues
jest.mock('@presentation/guards/jwt-auth.guard', () => ({
    JwtAuthGuard: jest.fn().mockImplementation(() => ({
        canActivate: () => true,
    })),
}));

describe('TankController', () => {
    let controller: TankController;
    let mockTankService: Partial<TankService>;

    // Mock user from JWT
    const mockUser = {
        id: 1,
        authId: 'auth-123',
        fullname: 'Test User',
        createdAt: new Date(),
    };

    // Mock tank data
    const mockTankDto: TankDto = {
        id: 1,
        name: 'Test Tank',
        width: 60,
        height: 40,
        length: 30,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockMeta: PaginationMeta = {
        total: 1,
        lastPage: 1,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: null,
    };

    const mockPaginatedResult = PaginatedResult.create([mockTankDto], mockMeta);

    beforeEach(async () => {
        mockTankService = {
            create: jest.fn().mockResolvedValue(mockTankDto),
            findAll: jest.fn().mockResolvedValue(mockPaginatedResult),
            findById: jest.fn().mockResolvedValue(mockTankDto),
            findByUserId: jest.fn().mockResolvedValue(mockPaginatedResult),
            update: jest.fn().mockResolvedValue(mockTankDto),
            delete: jest.fn().mockResolvedValue(undefined),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TankController],
            providers: [
                {
                    provide: TankService,
                    useValue: mockTankService,
                },
            ],
        }).compile();

        controller = module.get<TankController>(TankController);
    });

    describe('create', () => {
        it('should create a tank and return success response', async () => {
            const createDto = { name: 'New Tank', width: 60, height: 40, length: 30 };

            const result = await controller.create(createDto, mockUser as any);

            expect(mockTankService.create).toHaveBeenCalledWith(createDto, mockUser.id);
            expect(result.success).toBe(true);
            expect(result.message).toBe('Tank created successfully');
        });

        it('should return error response on failure', async () => {
            mockTankService.create = jest.fn().mockRejectedValue(new Error('Creation failed'));

            const result = await controller.create({} as any, mockUser as any);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Creation failed');
        });
    });

    describe('findAll', () => {
        it('should return paginated all tanks', async () => {
            const result = await controller.findAll(mockUser as any, 1, 10);
            expect(mockTankService.findAll).toHaveBeenCalledWith(mockUser.id, 1, 10);
            expect(result.success).toBe(true);
            expect(result.data?.items).toHaveLength(1);
            expect(result.data?.meta).toEqual(mockMeta);
        });
    });

    describe('findMyTanks', () => {
        it('should return tanks for user', async () => {
            const result = await controller.findMyTanks(mockUser as any);

            expect(mockTankService.findByUserId).toHaveBeenCalledWith(mockUser.id);
            expect(result.success).toBe(true);
        });
    });

    describe('findById', () => {
        it('should return tank by id', async () => {
            const result = await controller.findById(1);

            expect(mockTankService.findById).toHaveBeenCalledWith(1);
            expect(result.success).toBe(true);
        });

        it('should return error when tank not found', async () => {
            mockTankService.findById = jest.fn().mockRejectedValue(new Error('Tank not found'));

            const result = await controller.findById(999);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Tank not found');
        });
    });

    describe('update', () => {
        it('should update tank and return success response', async () => {
            const updateDto = { name: 'Updated Tank' };

            const result = await controller.update(1, updateDto);

            expect(mockTankService.update).toHaveBeenCalledWith(1, updateDto);
            expect(result.success).toBe(true);
            expect(result.message).toBe('Tank updated successfully');
        });
    });

    describe('delete', () => {
        it('should delete tank and return success response', async () => {
            const result = await controller.delete(1);

            expect(mockTankService.delete).toHaveBeenCalledWith(1);
            expect(result.success).toBe(true);
            expect(result.message).toBe('Tank deleted successfully');
        });

        it('should return error when delete fails', async () => {
            mockTankService.delete = jest.fn().mockRejectedValue(new Error('Delete failed'));

            const result = await controller.delete(999);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Delete failed');
        });
    });
});
