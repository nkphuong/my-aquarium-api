import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { FishSpecies } from '../entities/fish-species.entity';
import { IFishSpeciesAccessor } from './fish-species.accessor.interface';

@Injectable()
export class FishSpeciesAccessor extends Accessor(FishSpecies) implements IFishSpeciesAccessor {

    // Override toDbId to return number for Int ID field (not BigInt)
    protected override toDbId(id: number): number {
        return id;
    }

    async findAll(keyword?: string): Promise<FishSpecies[]> {
        const whereClause: any = {};
        if (keyword) {
            whereClause.OR = [
                { name_en: { contains: keyword, mode: 'insensitive' } },
                { name_vn: { contains: keyword, mode: 'insensitive' } },
                { scientific_name: { contains: keyword, mode: 'insensitive' } },
                { aliases: { array_contains: keyword } },
            ];
        }
        const items = await this.delegate.findMany({
            where: whereClause,
            orderBy: { name_en: 'asc' },
        });
        return items.map((item) => FishSpecies.fromDatabase(item));
    }

    // Override save to handle upsert by name
    override async save(entity: FishSpecies): Promise<FishSpecies> {
        if (entity.exists) {
            return this.update(entity.id!, entity);
        }

        // Check for existing by name_en before creating
        const existing = await this.delegate.findUnique({
            where: { name_en: entity.name_en },
        });

        if (existing) {
            // Logic for upsert: update existing if found by name
            const updateData = entity.getUpdateData();
            const updated = await this.delegate.update({
                where: { id: existing.id },
                data: updateData,
            });
            return FishSpecies.fromDatabase(updated);
        }

        return this.create(entity);
    }
}
