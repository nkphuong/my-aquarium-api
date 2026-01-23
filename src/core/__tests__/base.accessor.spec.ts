import { BaseAccessor, TransactionClient } from '../accessors/base.accessor';
import { BaseEntity } from '../entities/base.entity';
import { PrismaService } from '../database/prisma.service';

// Mock Entity for testing
class TestEntity extends BaseEntity {
    name: string = '';
}

// Concrete Accessor for testing
class TestEntityAccessor extends BaseAccessor<TestEntity> {
    constructor(prisma: PrismaService) {
        super(prisma, TestEntity);
    }

    // Expose delegate for testing
    getDelegate() {
        return this.delegate;
    }

    // Override modelName for testing
    protected get modelName(): string {
        return 'testEntity';
    }
}

describe('BaseAccessor.withTransaction', () => {
    let accessor: TestEntityAccessor;
    let mockPrisma: jest.Mocked<PrismaService>;
    let mockTransactionClient: jest.Mocked<TransactionClient>;

    beforeEach(() => {
        mockPrisma = {
            testEntity: {
                findUnique: jest.fn(),
                create: jest.fn(),
            },
        } as unknown as jest.Mocked<PrismaService>;

        mockTransactionClient = {
            testEntity: {
                findUnique: jest.fn(),
                create: jest.fn(),
            },
        } as unknown as jest.Mocked<TransactionClient>;

        accessor = new TestEntityAccessor(mockPrisma);
    });

    describe('withTransaction', () => {
        it('should return a cloned accessor with transaction client', () => {
            const transactionalAccessor = accessor.withTransaction(mockTransactionClient);

            expect(transactionalAccessor).not.toBe(accessor);
            expect(transactionalAccessor).toBeInstanceOf(TestEntityAccessor);
        });

        it('should use transaction client delegate instead of prisma', () => {
            const transactionalAccessor = accessor.withTransaction(mockTransactionClient);

            // Original accessor uses prisma
            expect(accessor.getDelegate()).toBe((mockPrisma as any).testEntity);

            // Transactional accessor uses tx client
            expect(transactionalAccessor.getDelegate()).toBe((mockTransactionClient as any).testEntity);
        });

        it('should not modify original accessor', () => {
            accessor.withTransaction(mockTransactionClient);

            // Original should still use prisma
            expect(accessor.getDelegate()).toBe((mockPrisma as any).testEntity);
        });

        it('should allow chaining multiple operations with same tx', async () => {
            const tx = mockTransactionClient as any;

            const accessor1 = accessor.withTransaction(mockTransactionClient);
            const accessor2 = accessor.withTransaction(mockTransactionClient);

            // Both should use the same transaction client
            expect(accessor1.getDelegate()).toBe(tx.testEntity);
            expect(accessor2.getDelegate()).toBe(tx.testEntity);
        });
    });
});
