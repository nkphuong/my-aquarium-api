/**
 * Pagination DTOs for request and response handling
 */

/**
 * Request DTO for pagination parameters
 */
export class PaginationRequestDto {
    page: number = 1;
    limit: number = 10;

    constructor(page?: number, limit?: number) {
        this.page = page ?? 1;
        this.limit = limit ?? 10;
    }
}

/**
 * Pagination metadata in responses
 */
export interface PaginationMeta {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
}

/**
 * Generic paginated result wrapper
 */
export class PaginatedResult<T> {
    items: T[];
    meta: PaginationMeta;

    constructor(items: T[], meta: PaginationMeta) {
        this.items = items;
        this.meta = meta;
    }

    static create<T>(items: T[], meta: PaginationMeta): PaginatedResult<T> {
        return new PaginatedResult(items, meta);
    }
}
