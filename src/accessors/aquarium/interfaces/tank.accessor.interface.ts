import { Tank } from '@entities/tank.entity';
import { PaginationMeta } from '@core/types/pagination';

export interface PaginatedTanks {
  data: Tank[];
  meta: PaginationMeta;
}

export interface ITankAccessor {
  findById(id: number): Promise<Tank | null>;
  findAll(
    page: number,
    perPage: number,
    includeArchived?: boolean,
  ): Promise<PaginatedTanks>;
  findByUserId(userId: number, includeArchived?: boolean): Promise<Tank[]>;
  save(tank: Tank): Promise<Tank>;
  update(id: number, tank: Tank): Promise<Tank>;
  delete(id: number): Promise<void>;
}

export const TANK_ACCESSOR = Symbol('ITankAccessor');
