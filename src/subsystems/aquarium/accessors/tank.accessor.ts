import { Injectable } from '@nestjs/common';
import { Tank } from '../entities/tank.entity';
import {
  ITankAccessor,
  PaginatedTanks,
} from '../contracts/tank.accessor.interface';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import type { FilterQuery } from '@mikro-orm/core';

@Injectable()
export class TankAccessor extends BaseDbAccessor implements ITankAccessor {
  async findById(id: number): Promise<Tank | null> {
    return this.em.findOne(Tank, { id });
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    includeArchived: boolean = false,
  ): Promise<PaginatedTanks> {
    const where: FilterQuery<Tank> = {};
    if (!includeArchived) {
      where.is_archived = false;
    }

    const [tanks, total] = await this.em.findAndCount(Tank, where, {
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: { createdAt: 'DESC' },
    });

    const pageCount = Math.ceil(total / perPage);

    return {
      data: tanks,
      meta: {
        total: total,
        lastPage: pageCount,
        currentPage: page,
        perPage: perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < pageCount ? page + 1 : null,
      },
    };
  }

  async findByUserId(
    userId: number,
    includeArchived: boolean = false,
  ): Promise<Tank[]> {
    const where: FilterQuery<Tank> = {
      user_id: userId,
    };
    if (!includeArchived) {
      where.is_archived = false;
    }
    return this.em.find(Tank, where);
  }

  async save(tank: Tank): Promise<Tank> {
    await this.em.persist(tank).flush();
    return tank;
  }

  async update(id: number, tank: Tank): Promise<Tank> {
    this.em.assign(tank, { id });
    await this.em.flush();
    return tank;
  }

  async delete(id: number): Promise<void> {
    const tank = await this.em.findOne(Tank, { id });
    if (tank) {
      await this.em.remove(tank).flush();
    }
  }
}
