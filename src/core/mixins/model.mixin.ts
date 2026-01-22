import { BaseEntity } from '../entities/base.entity';

/**
 * Type helper to convert Prisma types (BigInt, Decimal) to domain types (number).
 */
type Domainify<T> = {
    [K in keyof T]: T[K] extends bigint
    ? number
    : T[K] extends bigint | null
    ? number | null
    : T[K] extends { toNumber(): number }
    ? number
    : T[K] extends { toNumber(): number } | null
    ? number | null
    : T[K]
};

/**
 * Laravel-style Model Factory.
 * 
 * Usage:
 * export class Livestock extends Model<PrismaLivestock>() {}
 * 
 * Features:
 * 1. Auto-defines properties from Prisma Schema (T).
 * 2. Inherits from BaseEntity (ActiveRecord logic).
 * 3. Handles BigInt -> number conversion in types.
 */
export function Model<T, OmitKeys extends keyof T = never>(): {
    new(): BaseEntity & Domainify<Omit<T, 'id' | 'created_at' | 'updated_at' | OmitKeys>>;
    fromDatabase: typeof BaseEntity.fromDatabase;
} {
    // Return BaseEntity as the implementation
    return BaseEntity as any;
}
