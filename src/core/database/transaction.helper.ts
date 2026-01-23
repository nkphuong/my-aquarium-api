import { Injectable } from '@nestjs/common';
import { tryit, guard } from 'radash';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { TransactionException } from '@core/exceptions/domain.exception';

/**
 * Type alias for Prisma transaction client
 * Used by Accessors when operating within a transaction
 */
export type TransactionClient = Prisma.TransactionClient;

/**
 * Callback function signature for transaction operations
 */
export type TransactionCallback<T> = (tx: TransactionClient) => Promise<T>;

/**
 * TransactionHelper - Wrapper for Prisma transactions using radash utilities
 * 
 * Uses radash `tryit` for error-first handling (no try/catch blocks)
 * Uses radash `guard` when you want to suppress errors with fallback
 * 
 * @example
 * // Basic usage
 * const result = await this.transaction.execute(async (tx) => {
 *     const tank = await this.tankAccessor.withTransaction(tx).save(tank);
 *     const fish = await this.fishAccessor.withTransaction(tx).save(fish);
 *     return tank;
 * });
 * 
 * @example
 * // With fallback value (silent error)
 * const result = await this.transaction.executeOrDefault(defaultValue, async (tx) => {
 *     // if fails, returns defaultValue instead of throwing
 * });
 */
@Injectable()
export class TransactionHelper {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Execute operations within a database transaction
     * Uses radash `tryit` for clean error handling
     * 
     * @throws DomainException if transaction fails
     */
    async execute<T>(callback: TransactionCallback<T>): Promise<T> {
        const [err, result] = await tryit(
            this.prisma.$transaction.bind(this.prisma)
        )(callback);

        if (err) {
            throw new TransactionException(err.message);
        }

        return result as T;
    }

    /**
     * Execute transaction with a fallback value on failure
     * Uses radash `guard` - returns null on any error
     * 
     * @returns Result or null if transaction fails
     */
    async executeOrNull<T>(callback: TransactionCallback<T>): Promise<T | null> {
        const result = await guard(() => this.prisma.$transaction(callback));
        return result ?? null;
    }

    /**
     * Execute transaction with a custom fallback value
     * Useful when you want a default value instead of throwing
     */
    async executeOrDefault<T>(
        defaultValue: T,
        callback: TransactionCallback<T>,
    ): Promise<T> {
        return (await this.executeOrNull(callback)) ?? defaultValue;
    }
}
