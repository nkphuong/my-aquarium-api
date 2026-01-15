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

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
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
        email: entity.email,
        password: entity.password!,
        fullname: entity.fullname,
        refresh_token_hash: entity.refreshTokenHash,
      },
    });
    return this.toDomain(user);
  }

  async update(id: number, entity: Partial<User>): Promise<User> {
    const updateData: any = {};
    if (entity.fullname !== undefined) updateData.fullname = entity.fullname;
    if (entity.refreshTokenHash !== undefined) updateData.refresh_token_hash = entity.refreshTokenHash;

    const user = await this.prisma.user.update({
      where: { id: BigInt(id) },
      data: updateData,
    });
    return this.toDomain(user);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id: BigInt(id) } });
  }

  private toDomain(prismaUser: any): User {
    return new User(
      Number(prismaUser.id),
      prismaUser.email,
      prismaUser.password,
      prismaUser.fullname,
      prismaUser.refresh_token_hash,
      prismaUser.created_at,
    );
  }
}
