import { Injectable } from '@nestjs/common';
import { camel } from 'radash';
import { PrismaService } from '@core/database/prisma.service';
import { BaseEntity } from '@core/entities/base.entity';


export interface EntityClass<T extends BaseEntity> {
    new(): T;
    fromDatabase(data: Record<string, any>): T;
}

/**
 * Base accessor with common CRUD operations
 * Auto-resolves Prisma delegate by entity class name (like Laravel)
 * 
 * Example: LivestockAccessor<Livestock> → prisma.livestock
 */
@Injectable()
export abstract class BaseAccessor<T extends BaseEntity> {
    constructor(protected readonly prisma: PrismaService) { }

    /**
     * Entity class for auto-resolving delegate - override in child
     */
    protected abstract readonly entityClass: EntityClass<T>;


    /**
     * Auto-resolve Prisma delegate from entity class name
     * Livestock → prisma.livestock
     * WaterParameter → prisma.waterParameter (handles multi-word)
     */
    protected get delegate(): any {
        const className = this.entityClass.name;
        // Convert PascalCase to camelCase: Livestock → livestock, WaterParameter → waterParameter
        const delegateName = camel(className);
        return (this.prisma as any)[delegateName];
    }

    /**
     * Convert numeric ID to database format (BigInt for this project)
     */
    protected toDbId(id: number): bigint | number {
        return BigInt(id);
    }

    async findById(id: number): Promise<T | null> {
        const data = await this.delegate.findUnique({
            where: { id: this.toDbId(id) },
        });
        return data ? this.entityClass.fromDatabase(data) : null;
    }

    async save(entity: T): Promise<T> {
        if (entity.exists) {
            return this.update(entity.id!, entity);
        }
        return this.create(entity);
    }

    async create(entity: T): Promise<T> {
        entity.prepareForCreate();
        const data = await this.delegate.create({
            data: entity.toDatabase(),
        });
        return this.entityClass.fromDatabase(data);
    }

    async update(id: number, entity: T): Promise<T> {
        const updateData = entity.getUpdateData();
        const data = await this.delegate.update({
            where: { id: this.toDbId(id) },
            data: updateData,
        });
        return this.entityClass.fromDatabase(data);
    }

    async delete(id: number): Promise<void> {
        await this.delegate.delete({
            where: { id: this.toDbId(id) },
        });
    }
}
