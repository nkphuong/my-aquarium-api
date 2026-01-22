import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/database/prisma.service';
import { BaseAccessor } from '@core/accessors/base.accessor';
import { Fish } from '../entities/fish.entity';
import { IFishAccessor } from './fish.accessor.interface';

@Injectable()
export class FishAccessor extends BaseAccessor<Fish> implements IFishAccessor {
    protected readonly entityClass = Fish;

    constructor(prisma: PrismaService) {
        super(prisma);
    }

    async findAll(): Promise<Fish[]> {
        const fishes = await this.delegate.findMany();
        return fishes.map((f) => Fish.fromDatabase(f));
    }

    async findBySpecies(species: string): Promise<Fish[]> {
        const fishes = await this.delegate.findMany({ where: { species } });
        return fishes.map((f) => Fish.fromDatabase(f));
    }
}
