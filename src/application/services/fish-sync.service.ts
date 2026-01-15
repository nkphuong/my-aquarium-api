import { Injectable, Logger } from '@nestjs/common';
import { FishBaseService } from '@infrastructure/external/fishbase.service';
import { FishSpeciesRepository } from '@infrastructure/repositories/fish-species.repository';
import { FishSpecies } from '@domain/entities/fish-species.entity';

@Injectable()
export class FishSyncService {
    private readonly logger = new Logger(FishSyncService.name);

    constructor(
        private readonly fishBaseService: FishBaseService,
        private readonly fishSpeciesRepository: FishSpeciesRepository,
    ) { }

    async syncAll(): Promise<{ count: number; message: string }> {
        this.logger.log('Starting FishBase synchronization...');

        try {
            // 1. Fetch data from external source
            const rawData = await this.fishBaseService.fetchSpeciesData();

            this.logger.log(`Fetched ${rawData.length} species. Processing...`);

            // 2. Map and Save
            let savedCount = 0;
            for (const item of rawData) {
                const entity = new FishSpecies(
                    0, // ID will be ignored/overwritten by Repo logic
                    item.name_en,
                    item.name_vn,
                    item.temp_min,
                    item.temp_max,
                    item.ph_min,
                    item.ph_max,
                    item.min_tank_size,
                    item.size_max,
                    item.care_level,
                    item.temperament,
                    item.diet_type,
                    item.description,
                    item.scientific_name,
                    item.aliases,
                    item.image_url,
                    item.gh_min,
                    item.gh_max,
                    item.bioload_level,
                    item.flow_preference,
                    item.is_schooling,
                    item.min_school_size,
                    item.plant_safe,
                    item.substrate_digger,
                    item.jumper,
                );

                await this.fishSpeciesRepository.save(entity);
                savedCount++;
            }

            this.logger.log(`Synchronization complete. Updated ${savedCount} species.`);
            return { count: savedCount, message: 'Synchronization completed successfully' };

        } catch (error) {
            this.logger.error('Synchronization failed', error.stack);
            throw error;
        }
    }
}
