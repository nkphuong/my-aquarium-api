import { Injectable } from '@nestjs/common';
import { User } from '@domain/entities/user.entity';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: BigInt(id) } });
    return user ? this.toDomain(user) : null;
  }


  async findByAuthId(auth_id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { auth_id },
    });
    return user ? this.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.toDomain);
  }

  async save(entity: User): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        auth_id: entity.auth_id,
        fullname: entity.fullname,
      },
    });
    return this.toDomain(user);
  }

  async update(id: number, entity: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: BigInt(id) as any },
      data: {
        fullname: entity.fullname,
      },
    });
    return this.toDomain(user);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id: BigInt(id) as any } });
  }

  private toDomain(prismaUser: any): User {
    return new User(
      Number(prismaUser.id),
      prismaUser.auth_id,
      prismaUser.fullname,
      prismaUser.created_at,
      prismaUser.created_at,
    );
  }
}
