import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Livestock } from '@domain/entities/livestock.entity';
import { LivestockType, LivestockStatus } from '@domain/enums/livestock.enum';

@Injectable()
export class LivestockRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number): Promise<Livestock | null> {
        const item = await this.prisma.livestock.findUnique({
            where: { id: BigInt(id) },
        });
        return item ? this.toDomain(item) : null;
    }

    async findByTankId(tankId: number): Promise<Livestock[]> {
        const items = await this.prisma.livestock.findMany({
            where: { tank_id: BigInt(tankId) },
            orderBy: { created_at: 'desc' },
        });
        return items.map(this.toDomain);
    }

    async save(entity: Livestock): Promise<Livestock> {
        const data: any = {
            name: entity.name,
            type: entity.type,
            quantity: entity.quantity,
            status: entity.status,
            added_date: entity.added_date,
            tank_id: entity.tank_id ? BigInt(entity.tank_id) : null,
            scientific_name: entity.scientific_name,
            fishbase_id: entity.fishbase_id,
            image_url: entity.image_url,
        };

        if (entity.id) {
            // Update logic if ID exists but usually save is used for create in this pattern or distinct update method
            // Here assuming create
            const created = await this.prisma.livestock.create({ data });
            return this.toDomain(created);
        } else {
            const created = await this.prisma.livestock.create({ data });
            return this.toDomain(created);
        }
    }

    async create(entity: Livestock): Promise<Livestock> {
        const data = {
            name: entity.name,
            type: entity.type,
            quantity: entity.quantity,
            status: entity.status,
            added_date: entity.added_date,
            tank_id: entity.tank_id ? BigInt(entity.tank_id) : null,
            scientific_name: entity.scientific_name,
            fishbase_id: entity.fishbase_id,
            image_url: entity.image_url,
        };

        const created = await this.prisma.livestock.create({ data });
        return this.toDomain(created);
    }

    async update(id: number, entity: Livestock): Promise<Livestock> {
        const data = {
            name: entity.name,
            type: entity.type,
            quantity: entity.quantity,
            status: entity.status,
            added_date: entity.added_date,
            scientific_name: entity.scientific_name,
            image_url: entity.image_url,
        };

        const updated = await this.prisma.livestock.update({
            where: { id: BigInt(id) },
            data
        });
        return this.toDomain(updated);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.livestock.delete({
            where: { id: BigInt(id) },
        });
    }

    private toDomain(prismaItem: any): Livestock {
        return new Livestock(
            Number(prismaItem.id),
            prismaItem.name,
            prismaItem.type as LivestockType,
            prismaItem.quantity,
            prismaItem.status as LivestockStatus,
            prismaItem.added_date,
            prismaItem.tank_id ? Number(prismaItem.tank_id) : null,
            prismaItem.scientific_name,
            prismaItem.fishbase_id,
            prismaItem.image_url,
            prismaItem.created_at,
            prismaItem.updated_at,
        );
    }
}
