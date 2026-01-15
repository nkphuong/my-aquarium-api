import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { WaterParameter } from '@domain/entities/water-parameter.entity';

@Injectable()
export class WaterParameterRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByTankId(tankId: number): Promise<WaterParameter[]> {
        const items = await this.prisma.waterParameter.findMany({
            where: { tank_id: BigInt(tankId) },
            orderBy: { tested_at: 'desc' },
        });
        return items.map(this.toDomain);
    }

    async findLatestByTankId(tankId: number): Promise<WaterParameter | null> {
        const item = await this.prisma.waterParameter.findFirst({
            where: { tank_id: BigInt(tankId) },
            orderBy: { tested_at: 'desc' },
        });
        return item ? this.toDomain(item) : null;
    }

    async create(entity: WaterParameter): Promise<WaterParameter> {
        const data = {
            tank_id: BigInt(entity.tank_id),
            tested_at: entity.tested_at,
            temperature: entity.temperature,
            ph: entity.ph,
            ammonia: entity.ammonia,
            nitrite: entity.nitrite,
            nitrate: entity.nitrate,
            gh: entity.gh,
            kh: entity.kh,
            notes: entity.notes,
        };

        const created = await this.prisma.waterParameter.create({ data });
        return this.toDomain(created);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.waterParameter.delete({
            where: { id: BigInt(id) },
        });
    }

    private toDomain(prismaItem: any): WaterParameter {
        return new WaterParameter(
            Number(prismaItem.id),
            Number(prismaItem.tank_id),
            prismaItem.tested_at,
            prismaItem.temperature ? Number(prismaItem.temperature) : null,
            prismaItem.ph ? Number(prismaItem.ph) : null,
            prismaItem.ammonia ? Number(prismaItem.ammonia) : null,
            prismaItem.nitrite ? Number(prismaItem.nitrite) : null,
            prismaItem.nitrate ? Number(prismaItem.nitrate) : null,
            prismaItem.gh ? Number(prismaItem.gh) : null,
            prismaItem.kh ? Number(prismaItem.kh) : null,
            prismaItem.notes,
            prismaItem.created_at,
            prismaItem.updated_at,
        );
    }
}
