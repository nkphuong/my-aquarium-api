import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FishBaseService {
    private readonly logger = new Logger(FishBaseService.name);

    // This would ideally connect to FishBase API or read a local dump
    // For Phase 4, we simulate fetching "new" data
    async fetchSpeciesData(): Promise<any[]> {
        this.logger.log('Fetching species data from external source (Simulated)...');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample Data (Mocking what we'd get from FishBase/Data Dump)
        return [
            {
                name_en: 'Neon Tetra',
                name_vn: 'Cá Neon Xanh',
                scientific_name: 'Paracheirodon innesi',
                aliases: ['Neon Fish'],
                image_url: 'https://example.com/neon-tetra.jpg',
                temp_min: 20,
                temp_max: 28,
                ph_min: 5.0,
                ph_max: 7.0,
                gh_min: 2,
                gh_max: 10,
                min_tank_size: 40,
                size_max: 4,
                bioload_level: 2,
                flow_preference: 'slow',
                care_level: 'Easy',
                temperament: 'Peaceful',
                diet_type: 'Omnivore',
                is_schooling: true,
                min_school_size: 6,
                plant_safe: true,
                substrate_digger: false,
                jumper: false,
                description: 'A popular freshwater fish known for its bright blue and red stripes.',
            },
            {
                name_en: 'Betta',
                name_vn: 'Cá Xiêm',
                scientific_name: 'Betta splendens',
                aliases: ['Siamese Fighting Fish'],
                image_url: 'https://example.com/betta.jpg',
                temp_min: 24,
                temp_max: 30,
                ph_min: 6.0,
                ph_max: 8.0,
                gh_min: 5,
                gh_max: 25,
                min_tank_size: 20,
                size_max: 7,
                bioload_level: 3,
                flow_preference: 'slow',
                care_level: 'Easy',
                temperament: 'Semi-Aggressive',
                diet_type: 'Carnivore',
                is_schooling: false,
                min_school_size: 1,
                plant_safe: true,
                substrate_digger: false,
                jumper: true,
                description: 'Known for their brilliant colors and flowing fins.',
            }
        ];
    }
}
