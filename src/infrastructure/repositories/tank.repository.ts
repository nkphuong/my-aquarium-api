import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Tank } from '@domain/entities/tank.entity';
import { PaginationMeta } from '@application/dtos/pagination.dto';
import { TankDimensions, TankType } from '@domain/enums/tank.enum';
import { Prisma } from '@prisma/client';

export interface PaginatedTanks<T> {
  data: T[];
  meta: PaginationMeta;
}

@Injectable()
export class TankRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: number): Promise<Tank | null> {
    const tank = await this.prisma.tank.findUnique({
      where: { id: BigInt(id) },
    });
    return tank ? this.toDomain(tank) : null;
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    includeArchived: boolean = false
  ): Promise<PaginatedTanks<Tank>> {
    const where: Prisma.TankWhereInput = includeArchived
      ? {}
      : { is_archived: false };

    const [tanks, meta] = await this.prisma.extended.tank.paginate().withPages({
      limit: perPage,
      page,
      includePageCount: true,
      where, // Apply filter
    });

    return {
      data: tanks.map(this.toDomain),
      meta: {
        total: meta.totalCount,
        lastPage: meta.pageCount,
        currentPage: meta.currentPage,
        perPage: perPage,
        prev: meta.previousPage,
        next: meta.nextPage,
      },
    };
  }

  async findByUserId(user_id: number, includeArchived: boolean = false): Promise<Tank[]> {
    const where: Prisma.TankWhereInput = {
      user_id: BigInt(user_id),
      ...(includeArchived ? {} : { is_archived: false }),
    };

    const tanks = await this.prisma.tank.findMany({
      where,
    });

    return tanks.map(this.toDomain);
  }

  async save(entity: Tank): Promise<Tank> {
    const data: Prisma.TankCreateInput = {
      name: entity.name,
      dimensions: entity.dimensions as unknown as Prisma.InputJsonValue, // Cast interface to Json
      tank_type: entity.tank_type,
      style: entity.style,
      description: entity.description,
      substrate: entity.substrate,
      filter_type: entity.filter_type,
      cover_image_url: entity.cover_image_url,
      setup_date: entity.setup_date,
      volume_liters: entity.volume_liters,
      is_archived: entity.is_archived,
      user: entity.user_id ? { connect: { id: BigInt(entity.user_id) } } : undefined,
    };

    const tank = await this.prisma.tank.create({
      data,
    });
    return this.toDomain(tank);
  }

  async update(id: number, entity: Partial<Tank>): Promise<Tank> {
    const tank = await this.prisma.tank.update({
      where: { id: BigInt(id) },
      data: {
        name: entity.name,
        dimensions: entity.dimensions as unknown as Prisma.InputJsonValue,
        tank_type: entity.tank_type,
        style: entity.style,
        description: entity.description,
        substrate: entity.substrate,
        filter_type: entity.filter_type,
        cover_image_url: entity.cover_image_url,
        setup_date: entity.setup_date,
        volume_liters: entity.volume_liters,
        is_archived: entity.is_archived,
        user_id: entity.user_id ? BigInt(entity.user_id) : undefined,
      },
    });
    return this.toDomain(tank);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.tank.delete({ where: { id: BigInt(id) } });
  }

  private toDomain(prismaTank: any): Tank {
    // Check if dimensions is a string (Json sometimes comes as string from DB or raw query) or object
    let dimensions: TankDimensions | undefined = undefined;
    if (prismaTank.dimensions) {
      dimensions = typeof prismaTank.dimensions === 'string'
        ? JSON.parse(prismaTank.dimensions)
        : prismaTank.dimensions as TankDimensions;
    }

    return new Tank(
      Number(prismaTank.id),
      prismaTank.name,
      dimensions,
      prismaTank.tank_type,
      prismaTank.style,
      prismaTank.description,
      prismaTank.setup_date,
      prismaTank.volume_liters ? Number(prismaTank.volume_liters) : undefined,
      prismaTank.cover_image_url,
      prismaTank.substrate,
      prismaTank.filter_type,
      prismaTank.is_archived,
      prismaTank.user_id ? Number(prismaTank.user_id) : undefined,
      prismaTank.created_at,
      prismaTank.updated_at,
    );
  }
}
