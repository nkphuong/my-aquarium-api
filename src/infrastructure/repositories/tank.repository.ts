import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Tank } from '@domain/entities/tank.entity';

@Injectable()
export class TankRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Tank | null> {
    const tank = await this.prisma.tank.findUnique({ where: { id: BigInt(id) } });
    return tank ? this.toDomain(tank) : null;
  }

  async findAll(): Promise<Tank[]> {
    const tanks = await this.prisma.tank.findMany();
    return tanks.map(this.toDomain);
  }

  async findByUserId(user_id: number): Promise<Tank[]> {
    const tanks = await this.prisma.tank.findMany({ where: { user_id: BigInt(user_id) } });
    return tanks.map(this.toDomain);
  }


  async save(entity: Tank): Promise<Tank> {
    const tank = await this.prisma.tank.create({
      data: {
        name: entity.name,
        width: entity.width,
        height: entity.height,
        length: entity.length,
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
      prismaTank.user_id ? Number(prismaTank.user_id) : undefined,
      prismaTank.created_at,
      prismaTank.updated_at,
    );
  }
}
