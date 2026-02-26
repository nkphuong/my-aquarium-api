import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { Tank } from '../entities/tank.entity';
import { ITankAccessor, PaginatedTanks } from './tank.accessor.interface';

@Injectable()
export class TankAccessor extends Accessor(Tank) implements ITankAccessor {
  async findAll(
    page: number = 1,
    perPage: number = 10,
    includeArchived: boolean = false,
  ): Promise<PaginatedTanks> {
    const where: any = {};
    if (!includeArchived) {
      where.is_archived = false;
    }

    const [tanks, total] = await this.repository.findAndCount(where, {
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: { createdAt: 'DESC' }, // Assuming default sort
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
    const where: any = {
      user_id: userId, // MikroORM handles number -> bigint if mapped
    };
    if (!includeArchived) {
      where.is_archived = false;
    }
    return this.repository.find(where);
  }
}
