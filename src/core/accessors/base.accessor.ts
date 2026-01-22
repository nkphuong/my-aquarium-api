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
    constructor(
        protected readonly prisma: PrismaService,
        protected readonly entityClass: EntityClass<T>,
    ) { }


    /**
     * Auto-resolve Prisma delegate from entity class name
     * Livestock → prisma.livestock
     * WaterParameter → prisma.waterParameter (handles multi-word)
     */
    /**
     * Get the model name from the Accessor class name.
     * FishAccessor -> fish
     * WaterParameterAccessor -> waterParameter
     * 
     * Can be overridden by child classes if naming convention doesn't match.
     */
    protected get modelName(): string {
        const className = this.constructor.name;
        // Strip 'Accessor' suffix and camelCase the result
        return camel(className.replace(/Accessor$/, ''));
    }

    /**
     * Auto-resolve Prisma delegate from model name
     */
    protected get delegate(): any {
        return (this.prisma as any)[this.modelName];
    }

    /**
     * Convert numeric ID to database format (BigInt for this project)
     */
    protected toDbId(id: number): bigint | number {
        return BigInt(id);
    }

    async findById(id: number): Promise<T | null> {
        return this.queryOne(
            this.delegate.findUnique({
                where: { id: this.toDbId(id) },
            })
        );
    }

    /**
     * Execute a Prisma query and hydrate the result into a single Entity
     */
    protected async queryOne(query: Promise<any>): Promise<T | null> {
        const data = await query;
        return data ? this.entityClass.fromDatabase(data) : null;
    }

    /**
     * Execute a Prisma query and hydrate the results into an array of Entities
     */
    protected async queryMany(query: Promise<any[]>): Promise<T[]> {
        const data = await query;
        return data.map((item) => this.entityClass.fromDatabase(item));
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
