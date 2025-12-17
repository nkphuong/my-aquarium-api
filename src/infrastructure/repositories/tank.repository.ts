import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Tank } from '@domain/entities/tank.entity';
import { PaginationMeta } from '@application/dtos/pagination.dto';

export interface PaginatedTanks {
  data: Tank[];
  meta: PaginationMeta;
}

@Injectable()
export class TankRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: number): Promise<Tank | null> {
    const tank = await this.prisma.tank.findUnique({ where: { id: BigInt(id) } });
    return tank ? this.toDomain(tank) : null;
  }

  async findAll(): Promise<Tank[]> {
    const tanks = await this.prisma.tank.findMany();
    return tanks.map(this.toDomain);
  }

  async findByUserId(user_id: number, page: number = 1, perPage: number = 10): Promise<Tank[] | PaginatedTanks> {
    // If pagination parameters are provided, return paginated result
    if (page !== undefined && perPage !== undefined) {
      const skip = (page - 1) * perPage;

      const [tanks, total] = await Promise.all([
        this.prisma.tank.findMany({
          where: { user_id: BigInt(user_id) },
          skip,
          take: perPage,
        }),
        this.prisma.tank.count({
          where: { user_id: BigInt(user_id) },
        }),
      ]);

      const lastPage = Math.ceil(total / perPage);

      return {
        data: tanks.map(this.toDomain),
        meta: {
          total,
          lastPage,
          currentPage: page,
          perPage,
          prev: page > 1 ? page - 1 : null,
          next: page < lastPage ? page + 1 : null,
        },
      };
    }

    // Return simple array if no pagination
    const tanks = await this.prisma.tank.findMany({
      where: { user_id: BigInt(user_id) },
    });

    return tanks.map(this.toDomain);
  }

  async save(entity: Tank): Promise<Tank> {
    const tank = await this.prisma.tank.create({
      data: {
        name: entity.name,
        width: entity.width,
        height: entity.height,
        length: entity.length,
        ...(entity.type !== undefined && { type: entity.type }),
        ...(entity.style !== undefined && { style: entity.style }),
        ...(entity.description !== undefined && { description: entity.description }),
        ...(entity.status !== undefined && { status: entity.status }),
        ...(entity.setup_at !== undefined && { setup_at: entity.setup_at }),
        ...(entity.water_volume !== undefined && { water_volume: entity.water_volume }),
        ...(entity.avatar !== undefined && { avatar: entity.avatar }),
        ...(entity.user_id !== undefined && { user_id: BigInt(entity.user_id) }),
      },
    });
    return this.toDomain(tank);
  }

  async update(id: number, entity: Partial<Tank>): Promise<Tank> {
    const tank = await this.prisma.tank.update({
      where: { id: BigInt(id) },
      data: {
        ...(entity.name !== undefined && { name: entity.name }),
        ...(entity.width !== undefined && { width: entity.width }),
        ...(entity.height !== undefined && { height: entity.height }),
        ...(entity.length !== undefined && { length: entity.length }),
        ...(entity.type !== undefined && { type: entity.type }),
        ...(entity.style !== undefined && { style: entity.style }),
        ...(entity.description !== undefined && { description: entity.description }),
        ...(entity.status !== undefined && { status: entity.status }),
        ...(entity.setup_at !== undefined && { setup_at: entity.setup_at }),
        ...(entity.water_volume !== undefined && { water_volume: entity.water_volume }),
        ...(entity.avatar !== undefined && { avatar: entity.avatar }),
        ...(entity.user_id !== undefined && { user_id: BigInt(entity.user_id) }),
      },
    });
    return this.toDomain(tank);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.tank.delete({ where: { id: BigInt(id) } });
  }

  private toDomain(prismaTank: any): Tank {
    return new Tank(
      Number(prismaTank.id),
      prismaTank.name,
      prismaTank.width,
      prismaTank.height,
      prismaTank.length,
      prismaTank.type,
      prismaTank.style,
      prismaTank.description,
      prismaTank.status,
      prismaTank.setup_at,
      prismaTank.water_volume,
      prismaTank.avatar,
      prismaTank.user_id ? Number(prismaTank.user_id) : undefined,
      prismaTank.created_at,
      prismaTank.updated_at,
    );
  }
}
