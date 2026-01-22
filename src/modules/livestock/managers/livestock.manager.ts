import { Injectable, Inject } from '@nestjs/common';
import { CreateLivestockRequest, UpdateLivestockRequest } from '../requests/livestock.request';
import { Livestock } from '../entities/livestock.entity';
import { EntityNotFoundException } from '@core/exceptions/domain.exception';
import type { ILivestockAccessor } from '../accessors/livestock.accessor.interface';
import { LIVESTOCK_ACCESSOR } from '../accessors/livestock.accessor.interface';
import { LivestockStatus } from '@modules/livestock/enums/livestock.enum';

@Injectable()
export class LivestockManager {
    constructor(
        @Inject(LIVESTOCK_ACCESSOR) private readonly livestockAccessor: ILivestockAccessor,
    ) { }

    async create(dto: CreateLivestockRequest): Promise<Livestock> {
        const entity = new Livestock();
        entity.fill({
            name: dto.name,
            type: dto.type,
            quantity: dto.quantity || 1,
            status: dto.status || LivestockStatus.HEALTHY,
            addedDate: dto.addedDate ? new Date(dto.addedDate) : new Date(),
            tankId: dto.tankId,
            scientificName: dto.scientificName,
            fishbaseId: dto.fishbaseId,
            imageUrl: dto.imageUrl,
        } as any);

        const saved = await this.livestockAccessor.save(entity);
        return saved;
    }

    async findByTankId(tankId: number): Promise<Livestock[]> {
        const items = await this.livestockAccessor.findByTankId(tankId);
        return items;
    }

    async findById(id: number): Promise<Livestock> {
        const item = await this.livestockAccessor.findById(id);
        if (!item) {
            throw new EntityNotFoundException('Livestock', id);
        }
        return item;
    }

    async update(id: number, dto: UpdateLivestockRequest): Promise<Livestock> {
        const item = await this.livestockAccessor.findById(id);
        if (!item) {
            throw new EntityNotFoundException('Livestock', id);
        }

        item.fill({
            name: dto.name ?? item.name,
            scientific_name: dto.scientificName ?? item.scientific_name,
            image_url: dto.imageUrl ?? item.image_url,
            added_date: dto.addedDate ? new Date(dto.addedDate) : item.added_date,
            quantity: dto.quantity ?? item.quantity,
            status: dto.status ?? item.status,
        } as any);

        const updated = await this.livestockAccessor.update(id, item);
        return updated;
    }

    async delete(id: number): Promise<void> {
        const item = await this.livestockAccessor.findById(id);
        if (!item) {
            throw new EntityNotFoundException('Livestock', id);
        }
        await this.livestockAccessor.delete(id);
    }
}
