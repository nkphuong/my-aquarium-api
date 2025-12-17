import { Test, TestingModule } from '@nestjs/testing';
import { TankService } from '../services/tank.service';
import { TankRepository, PaginatedTanks } from '@infrastructure/repositories/tank.repository';
import { CreateTankDto, UpdateTankDto, TankDto } from '@application/dtos/tank.dto';
import { Tank } from '@domain/entities/tank.entity';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

describe('TankService', () => {
    let service: TankService;
    let repository: jest.Mocked<TankRepository>;

    // Mock data
    const mockTank = new Tank(1, 'Test Tank', 60, 40, 30, 1);

    const mockPaginatedTanks: PaginatedTanks = {
        data: [mockTank],
        meta: {
            total: 1,
            lastPage: 1,
            currentPage: 1,
            perPage: 10,
            prev: null,
            next: null,
        },
    };

    beforeEach(async () => {
        // Create mock repository
        const mockRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TankService,
                {
                    provide: TankRepository,
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<TankService>(TankService);
        repository = module.get(TankRepository);
    });

    describe('create', () => {
        it('should create a tank and return TankDto', async () => {
            const createDto: CreateTankDto = {
                name: 'New Tank',
                width: 60,
                height: 40,
                length: 30,
            };
            const userId = 1;

            repository.save.mockResolvedValue(mockTank);

            const result = await service.create(createDto, userId);

            expect(repository.save).toHaveBeenCalledWith(expect.any(Tank));
            expect(result).toBeInstanceOf(TankDto);
            expect(result.name).toBe(mockTank.name);
        });
    });

    describe('findById', () => {
        it('should return TankDto when tank exists', async () => {
            repository.findById.mockResolvedValue(mockTank);

            const result = await service.findById(1);

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(result).toBeInstanceOf(TankDto);
            expect(result.id).toBe(mockTank.id);
        });

        it('should throw EntityNotFoundException when tank not found', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.findById(999)).rejects.toThrow(EntityNotFoundException);
        });
    });

    describe('findByUserId', () => {
        it('should return with tanks', async () => {
            repository.findByUserId.mockResolvedValue([mockTank]);

            const result = await service.findByUserId(1);

            expect(repository.findByUserId).toHaveBeenCalledWith(1);
            expect(result).toHaveLength(1);
        });
    });

    describe('findAll', () => {
        it('should return Paginated with tanks', async () => {
            repository.findByUserId.mockResolvedValue(mockPaginatedTanks);

            const result = await service.findAll(1, 1, 10);

            expect(repository.findByUserId).toHaveBeenCalledWith(1, 1, 10);
            expect(result.items).toHaveLength(1);
            expect(result.meta.currentPage).toBe(1);
            expect(result.meta.total).toBe(1);
        });
    });

    describe('update', () => {
        it('should update tank name and return TankDto', async () => {
            const updateDto: UpdateTankDto = { name: 'Updated Tank' };
            repository.findById.mockResolvedValue(mockTank);
            repository.update.mockResolvedValue(mockTank);

            const result = await service.update(1, updateDto);

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(repository.update).toHaveBeenCalled();
            expect(result).toBeInstanceOf(TankDto);
        });

        it('should throw EntityNotFoundException when tank not found', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.update(999, {})).rejects.toThrow(EntityNotFoundException);
        });

        it('should update dimensions when all provided', async () => {
            const updateDto: UpdateTankDto = { width: 80, height: 50, length: 40 };
            repository.findById.mockResolvedValue(mockTank);
            repository.update.mockResolvedValue(mockTank);

            await service.update(1, updateDto);

            expect(repository.update).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete tank when exists', async () => {
            repository.findById.mockResolvedValue(mockTank);
            repository.delete.mockResolvedValue();

            await service.delete(1);

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(repository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw EntityNotFoundException when tank not found', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.delete(999)).rejects.toThrow(EntityNotFoundException);
        });
    });

    describe('assignToUser', () => {
        it('should assign tank to user and return TankDto', async () => {
            repository.findById.mockResolvedValue(mockTank);
            repository.update.mockResolvedValue(mockTank);

            const result = await service.assignToUser(1, 2);

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(repository.update).toHaveBeenCalled();
            expect(result).toBeInstanceOf(TankDto);
        });

        it('should throw EntityNotFoundException when tank not found', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.assignToUser(999, 1)).rejects.toThrow(EntityNotFoundException);
        });
    });

    describe('removeFromUser', () => {
        it('should remove tank from user and return TankDto', async () => {
            repository.findById.mockResolvedValue(mockTank);
            repository.update.mockResolvedValue(mockTank);

            const result = await service.removeFromUser(1);

            expect(repository.findById).toHaveBeenCalledWith(1);
            expect(repository.update).toHaveBeenCalled();
            expect(result).toBeInstanceOf(TankDto);
        });

        it('should throw EntityNotFoundException when tank not found', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.removeFromUser(999)).rejects.toThrow(EntityNotFoundException);
        });
    });
});
