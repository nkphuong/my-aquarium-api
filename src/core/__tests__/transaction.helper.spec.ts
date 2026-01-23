import { TransactionHelper } from '../database/transaction.helper';
import { PrismaService } from '../database/prisma.service';
import { TransactionException } from '../exceptions/domain.exception';

describe('TransactionHelper', () => {
    let transactionHelper: TransactionHelper;
    let mockPrisma: jest.Mocked<PrismaService>;

    beforeEach(() => {
        mockPrisma = {
            $transaction: jest.fn(),
        } as unknown as jest.Mocked<PrismaService>;

        transactionHelper = new TransactionHelper(mockPrisma);
    });

    describe('execute', () => {
        it('should execute callback within transaction and return result', async () => {
            const expectedResult = { id: 1, name: 'Test' };
            mockPrisma.$transaction.mockImplementation(async (callback) => {
                return callback({} as any);
            });

            const result = await transactionHelper.execute(async () => expectedResult);

            expect(mockPrisma.$transaction).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('should throw TransactionException when transaction fails', async () => {
            mockPrisma.$transaction.mockRejectedValue(new Error('DB Error'));

            await expect(
                transactionHelper.execute(async () => 'result')
            ).rejects.toThrow(TransactionException);
        });

        it('should include original error message in TransactionException', async () => {
            mockPrisma.$transaction.mockRejectedValue(new Error('Connection lost'));

            await expect(
                transactionHelper.execute(async () => 'result')
            ).rejects.toThrow('Transaction failed: Connection lost');
        });
    });

    describe('executeOrNull', () => {
        it('should return result when transaction succeeds', async () => {
            const expectedResult = { id: 1 };
            mockPrisma.$transaction.mockResolvedValue(expectedResult);

            const result = await transactionHelper.executeOrNull(async () => expectedResult);

            expect(result).toEqual(expectedResult);
        });

        it('should return null when transaction fails', async () => {
            mockPrisma.$transaction.mockRejectedValue(new Error('DB Error'));

            const result = await transactionHelper.executeOrNull(async () => 'result');

            expect(result).toBeNull();
        });
    });

    describe('executeOrDefault', () => {
        it('should return result when transaction succeeds', async () => {
            const expectedResult = { id: 1 };
            mockPrisma.$transaction.mockResolvedValue(expectedResult);

            const result = await transactionHelper.executeOrDefault(
                { id: 0 },
                async () => expectedResult
            );

            expect(result).toEqual(expectedResult);
        });

        it('should return default value when transaction fails', async () => {
            const defaultValue = { id: -1, name: 'default' };
            mockPrisma.$transaction.mockRejectedValue(new Error('DB Error'));

            const result = await transactionHelper.executeOrDefault(
                defaultValue,
                async () => ({ id: 1, name: 'actual' })
            );

            expect(result).toEqual(defaultValue);
        });
    });
});
