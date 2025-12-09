import { Injectable } from '@nestjs/common';
import { Fish } from '@domain/entities/fish.entity';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class FishRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Fish | null> {
    const fish = await this.prisma.fish.findUnique({ where: { id: BigInt(id) } });
    return fish ? this.toDomain(fish) : null;
  }

  async findAll(): Promise<Fish[]> {
    const fishes = await this.prisma.fish.findMany();
    return fishes.map(this.toDomain);
  }

  async findBySpecies(species: string): Promise<Fish[]> {
    const fishes = await this.prisma.fish.findMany({ where: { species } });
    return fishes.map(this.toDomain);
  }


  async save(entity: Fish): Promise<Fish> {
    const fish = await this.prisma.fish.create({
      data: {
        name: entity.name,
        species: entity.species,
      },
    });
    return this.toDomain(fish);
  }

  async update(id: number, entity: Partial<Fish>): Promise<Fish> {
    const fish = await this.prisma.fish.update({
      where: { id: BigInt(id) },
      data: {
        name: entity.name,
        species: entity.species,
      },
    });
    return this.toDomain(fish);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.fish.delete({ where: { id: BigInt(id) } });
  }

  private toDomain(prismaFish: any): Fish {
    return new Fish(
      Number(prismaFish.id),
      prismaFish.name,
      prismaFish.species,
      prismaFish.tank_id ? Number(prismaFish.tank_id) : undefined,
      prismaFish.created_at,
      prismaFish.updated_at,
    );
  }
}
