import { PaginationRequestDto, PaginatedResult, PaginationMeta } from '../dtos/pagination.dto';

describe('PaginationRequestDto', () => {
    describe('constructor', () => {
        it('should create with default values', () => {
            const dto = new PaginationRequestDto();

            expect(dto.page).toBe(1);
            expect(dto.limit).toBe(10);
        });

        it('should create with custom values', () => {
            const dto = new PaginationRequestDto(2, 25);

            expect(dto.page).toBe(2);
            expect(dto.limit).toBe(25);
        });

        it('should use defaults when undefined passed', () => {
            const dto = new PaginationRequestDto(undefined, undefined);

            expect(dto.page).toBe(1);
            expect(dto.limit).toBe(10);
        });
    });
});

describe('PaginatedResult', () => {
    const mockMeta: PaginationMeta = {
        total: 100,
        lastPage: 10,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: 2,
    };

    describe('constructor', () => {
        it('should create with items and meta', () => {
            const items = [{ id: 1 }, { id: 2 }];
            const result = new PaginatedResult(items, mockMeta);

            expect(result.items).toEqual(items);
            expect(result.meta).toEqual(mockMeta);
        });
    });

    describe('create', () => {
        it('should create instance via factory method', () => {
            const items = [{ id: 1 }];
            const result = PaginatedResult.create(items, mockMeta);

            expect(result).toBeInstanceOf(PaginatedResult);
            expect(result.items).toEqual(items);
            expect(result.meta).toEqual(mockMeta);
        });

        it('should handle empty items array', () => {
            const emptyMeta: PaginationMeta = {
                total: 0,
                lastPage: 1,
                currentPage: 1,
                perPage: 10,
                prev: null,
                next: null,
            };
            const result = PaginatedResult.create([], emptyMeta);

            expect(result.items).toHaveLength(0);
            expect(result.meta.total).toBe(0);
        });
    });
});
