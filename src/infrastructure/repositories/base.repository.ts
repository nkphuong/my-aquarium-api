import { PrismaService } from '@infrastructure/database/prisma.service';

export abstract class BaseRepository<T> {
  constructor(protected readonly prisma: PrismaService) {}

  abstract findById(id: string | number): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract update(id: string | number, entity: Partial<T>): Promise<T>;
  abstract delete(id: string | number): Promise<void>;
}
