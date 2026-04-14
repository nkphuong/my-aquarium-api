import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { FishSpecies } from '../../subsystems/aquarium/entities/fish-species.entity';

const SPECIES_DATA = [
  // --- Livebearers ---
  {
    name_en: 'Guppy', name_vn: 'Cá bảy màu', scientific_name: 'Poecilia reticulata',
    aliases: ['fancy guppy', 'rainbow fish'],
    temp_min: 22, temp_max: 28, ph_min: 6.5, ph_max: 8.0,
    min_tank_size: 40, size_max: 5, bioload_level: 3,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'top',
    plant_safe: true, substrate_digger: false, jumper: true,
    description: 'Hardy and colorful livebearer, ideal for beginners.',
  },
  {
    name_en: 'Platy', name_vn: 'Cá mún', scientific_name: 'Xiphophorus maculatus',
    aliases: ['southern platyfish'],
    temp_min: 20, temp_max: 28, ph_min: 7.0, ph_max: 8.0,
    min_tank_size: 40, size_max: 6, bioload_level: 3,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Peaceful livebearer available in many color varieties.',
  },
  {
    name_en: 'Swordtail', name_vn: 'Cá kiếm', scientific_name: 'Xiphophorus hellerii',
    aliases: ['green swordtail'],
    temp_min: 22, temp_max: 28, ph_min: 7.0, ph_max: 8.3,
    min_tank_size: 80, size_max: 12, bioload_level: 4,
    care_level: 'EASY', temperament: 'SEMI_AGGRESSIVE', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: true,
    description: 'Active livebearer; males may chase each other.',
  },
  {
    name_en: 'Molly', name_vn: 'Cá mol', scientific_name: 'Poecilia sphenops',
    aliases: ['short-finned molly'],
    temp_min: 24, temp_max: 30, ph_min: 7.0, ph_max: 8.5,
    min_tank_size: 80, size_max: 10, bioload_level: 4,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Tolerates slightly brackish water; prefers warm, hard water.',
  },

  // --- Tetras ---
  {
    name_en: 'Neon Tetra', name_vn: 'Cá neon', scientific_name: 'Paracheirodon innesi',
    aliases: ['neon fish'],
    temp_min: 20, temp_max: 26, ph_min: 6.0, ph_max: 7.0,
    min_tank_size: 40, size_max: 4, bioload_level: 2,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 6, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Iconic schooling fish with vivid blue and red stripes.',
  },
  {
    name_en: 'Cardinal Tetra', name_vn: 'Cá neon đỏ', scientific_name: 'Paracheirodon axelrodi',
    aliases: ['cardinal fish'],
    temp_min: 23, temp_max: 28, ph_min: 5.5, ph_max: 7.0,
    min_tank_size: 60, size_max: 5, bioload_level: 2,
    care_level: 'MEDIUM', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 6, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Like neon tetra but with full red belly; needs soft, acidic water.',
  },
  {
    name_en: 'Black Skirt Tetra', name_vn: 'Cá neon đen', scientific_name: 'Gymnocorymbus ternetzi',
    aliases: ['black tetra', 'petticoat tetra'],
    temp_min: 20, temp_max: 26, ph_min: 5.8, ph_max: 7.5,
    min_tank_size: 60, size_max: 6, bioload_level: 3,
    care_level: 'EASY', temperament: 'SEMI_AGGRESSIVE', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 5, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Hardy tetra but may nip fins of long-finned tankmates.',
  },
  {
    name_en: 'Rummy Nose Tetra', name_vn: 'Cá mũi đỏ', scientific_name: 'Hemigrammus rhodostomus',
    aliases: ['rummy nose', 'firehead tetra'],
    temp_min: 22, temp_max: 26, ph_min: 5.5, ph_max: 7.0,
    min_tank_size: 80, size_max: 5, bioload_level: 2,
    care_level: 'MEDIUM', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 8, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Tight schooling fish; red nose fades when stressed.',
  },

  // --- Bettas ---
  {
    name_en: 'Betta', name_vn: 'Cá chọi', scientific_name: 'Betta splendens',
    aliases: ['siamese fighting fish', 'betta fish'],
    temp_min: 24, temp_max: 30, ph_min: 6.0, ph_max: 7.5,
    min_tank_size: 20, size_max: 7, bioload_level: 3,
    care_level: 'EASY', temperament: 'AGGRESSIVE', diet_type: 'CARNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'top',
    plant_safe: true, substrate_digger: false, jumper: true,
    description: 'Stunning but aggressive; males must be kept alone.',
  },

  // --- Cichlids ---
  {
    name_en: 'Angelfish', name_vn: 'Cá thần tiên', scientific_name: 'Pterophyllum scalare',
    aliases: ['scalar'],
    temp_min: 24, temp_max: 30, ph_min: 6.0, ph_max: 7.5,
    min_tank_size: 120, size_max: 15, bioload_level: 6,
    care_level: 'MEDIUM', temperament: 'SEMI_AGGRESSIVE', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Graceful cichlid; will eat small fish like neon tetras.',
  },
  {
    name_en: 'Discus', name_vn: 'Cá dĩa', scientific_name: 'Symphysodon aequifasciatus',
    aliases: ['king of the aquarium'],
    temp_min: 26, temp_max: 32, ph_min: 5.5, ph_max: 7.0,
    min_tank_size: 200, size_max: 20, bioload_level: 8,
    care_level: 'HARD', temperament: 'PEACEFUL', diet_type: 'CARNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'The king of the aquarium; demands pristine, warm, soft water.',
  },
  {
    name_en: 'Apistogramma', name_vn: 'Cá apisto', scientific_name: 'Apistogramma cacatuoides',
    aliases: ['cockatoo dwarf cichlid', 'apisto'],
    temp_min: 22, temp_max: 28, ph_min: 5.5, ph_max: 7.0,
    min_tank_size: 80, size_max: 8, bioload_level: 4,
    care_level: 'MEDIUM', temperament: 'SEMI_AGGRESSIVE', diet_type: 'CARNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'bottom',
    plant_safe: true, substrate_digger: true, jumper: false,
    description: 'Dwarf cichlid; males are territorial with conspecifics.',
  },

  // --- Catfish ---
  {
    name_en: 'Bronze Corydoras', name_vn: 'Cá chuột đồng', scientific_name: 'Corydoras aeneus',
    aliases: ['corydoras', 'cory cat'],
    temp_min: 22, temp_max: 28, ph_min: 6.0, ph_max: 7.5,
    min_tank_size: 60, size_max: 7, bioload_level: 3,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 6, water_level: 'bottom',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Hardy bottom dweller; must be kept in groups of 6+.',
  },
  {
    name_en: 'Otocinclus', name_vn: 'Cá oto', scientific_name: 'Otocinclus affinis',
    aliases: ['oto catfish', 'dwarf suckermouth'],
    temp_min: 20, temp_max: 27, ph_min: 6.0, ph_max: 7.5,
    min_tank_size: 60, size_max: 4, bioload_level: 2,
    care_level: 'MEDIUM', temperament: 'PEACEFUL', diet_type: 'HERBIVORE',
    is_schooling: true, min_school_size: 4, water_level: 'bottom',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Excellent algae eater; must be kept in groups.',
  },
  {
    name_en: 'Common Pleco', name_vn: 'Cá lau kính', scientific_name: 'Hypostomus plecostomus',
    aliases: ['pleco', 'sucker fish'],
    temp_min: 22, temp_max: 30, ph_min: 6.5, ph_max: 7.5,
    min_tank_size: 200, size_max: 50, bioload_level: 10,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'HERBIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'bottom',
    plant_safe: false, substrate_digger: true, jumper: false,
    description: 'Grows very large; damages plants; produces massive bioload.',
  },

  // --- Loaches ---
  {
    name_en: 'Clown Loach', name_vn: 'Cá hề', scientific_name: 'Chromobotia macracanthus',
    aliases: ['tiger loach'],
    temp_min: 25, temp_max: 30, ph_min: 6.0, ph_max: 7.5,
    min_tank_size: 200, size_max: 30, bioload_level: 7,
    care_level: 'MEDIUM', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 5, water_level: 'bottom',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Colorful and playful; grows large and needs big groups.',
  },
  {
    name_en: 'Kuhli Loach', name_vn: 'Cá chình cát', scientific_name: 'Pangio kuhlii',
    aliases: ['coolie loach'],
    temp_min: 24, temp_max: 30, ph_min: 5.5, ph_max: 7.0,
    min_tank_size: 60, size_max: 10, bioload_level: 3,
    care_level: 'MEDIUM', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 4, water_level: 'bottom',
    plant_safe: true, substrate_digger: false, jumper: true,
    description: 'Eel-like loach that hides during the day.',
  },

  // --- Rasboras ---
  {
    name_en: 'Harlequin Rasbora', name_vn: 'Cá sọc tam giác', scientific_name: 'Trigonostigma heteromorpha',
    aliases: ['harlequin fish'],
    temp_min: 22, temp_max: 27, ph_min: 6.0, ph_max: 7.5,
    min_tank_size: 60, size_max: 5, bioload_level: 2,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 6, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Popular schooling fish with distinctive triangle marking.',
  },
  {
    name_en: 'Chili Rasbora', name_vn: 'Cá ớt đỏ', scientific_name: 'Boraras brigittae',
    aliases: ['mosquito rasbora'],
    temp_min: 20, temp_max: 28, ph_min: 4.0, ph_max: 7.0,
    min_tank_size: 20, size_max: 2, bioload_level: 1,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 8, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Tiny nano fish; brilliant red; best in planted tanks.',
  },

  // --- Barbs ---
  {
    name_en: 'Tiger Barb', name_vn: 'Cá hổ vằn', scientific_name: 'Puntigrus tetrazona',
    aliases: ['sumatra barb'],
    temp_min: 20, temp_max: 26, ph_min: 6.0, ph_max: 7.0,
    min_tank_size: 80, size_max: 7, bioload_level: 4,
    care_level: 'EASY', temperament: 'SEMI_AGGRESSIVE', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 6, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Active and bold; nips fins of slow-moving fish. Keep in groups of 6+.',
  },
  {
    name_en: 'Cherry Barb', name_vn: 'Cá anh đào', scientific_name: 'Puntius titteya',
    aliases: ['red barb'],
    temp_min: 23, temp_max: 27, ph_min: 6.0, ph_max: 8.0,
    min_tank_size: 60, size_max: 5, bioload_level: 3,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: true, min_school_size: 5, water_level: 'mid',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Unlike most barbs, the cherry barb is peaceful and non-nippy.',
  },

  // --- Gouramis ---
  {
    name_en: 'Pearl Gourami', name_vn: 'Cá trân châu', scientific_name: 'Trichopodus leerii',
    aliases: ['lace gourami'],
    temp_min: 23, temp_max: 28, ph_min: 6.0, ph_max: 8.0,
    min_tank_size: 100, size_max: 12, bioload_level: 5,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'top',
    plant_safe: true, substrate_digger: false, jumper: true,
    description: 'Beautiful, peaceful gourami; one of the best community fish.',
  },
  {
    name_en: 'Dwarf Gourami', name_vn: 'Cá trân châu lùn', scientific_name: 'Trichogaster lalius',
    aliases: ['flame gourami', 'powder blue gourami'],
    temp_min: 22, temp_max: 28, ph_min: 6.0, ph_max: 7.5,
    min_tank_size: 60, size_max: 8, bioload_level: 4,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'top',
    plant_safe: true, substrate_digger: false, jumper: true,
    description: 'Vibrant colors; males may be aggressive toward similar fish.',
  },

  // --- Goldfish ---
  {
    name_en: 'Ranchu', name_vn: 'Cá vàng Ranchu', scientific_name: 'Carassius auratus',
    aliases: ['buffalo head goldfish', 'king of goldfish'],
    temp_min: 15, temp_max: 24, ph_min: 6.5, ph_max: 7.5,
    min_tank_size: 120, size_max: 20, bioload_level: 9,
    care_level: 'MEDIUM', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'mid',
    plant_safe: false, substrate_digger: true, jumper: false,
    description: 'Fancy goldfish with rounded body; needs cool water and strong filtration.',
  },
  {
    name_en: 'Oranda', name_vn: 'Cá vàng Oranda', scientific_name: 'Carassius auratus',
    aliases: ['oranda goldfish', 'flower of the water'],
    temp_min: 15, temp_max: 24, ph_min: 6.5, ph_max: 7.5,
    min_tank_size: 120, size_max: 23, bioload_level: 9,
    care_level: 'MEDIUM', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'mid',
    plant_safe: false, substrate_digger: true, jumper: false,
    description: 'Fancy goldfish with distinctive head growth (wen).',
  },

  // --- Shrimp ---
  {
    name_en: 'Cherry Shrimp', name_vn: 'Tép đỏ', scientific_name: 'Neocaridina davidi',
    aliases: ['red cherry shrimp', 'RCS'],
    temp_min: 20, temp_max: 28, ph_min: 6.5, ph_max: 8.0,
    min_tank_size: 20, size_max: 3, bioload_level: 1,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'bottom',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Hardy nano shrimp; great algae cleaners; will be eaten by larger fish.',
  },
  {
    name_en: 'Crystal Red Shrimp', name_vn: 'Tép tinh thể đỏ', scientific_name: 'Caridina cantonensis',
    aliases: ['CBS', 'bee shrimp'],
    temp_min: 18, temp_max: 24, ph_min: 5.8, ph_max: 6.8,
    min_tank_size: 30, size_max: 3, bioload_level: 1,
    care_level: 'HARD', temperament: 'PEACEFUL', diet_type: 'OMNIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'bottom',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'High-grade shrimp requiring soft, acidic water. Very sensitive.',
  },

  // --- Snails ---
  {
    name_en: 'Nerite Snail', name_vn: 'Ốc nerite', scientific_name: 'Vittina semiconica',
    aliases: ['zebra nerite', 'tiger nerite'],
    temp_min: 22, temp_max: 28, ph_min: 7.0, ph_max: 8.5,
    min_tank_size: 20, size_max: 2, bioload_level: 1,
    care_level: 'EASY', temperament: 'PEACEFUL', diet_type: 'HERBIVORE',
    is_schooling: false, min_school_size: 1, water_level: 'bottom',
    plant_safe: true, substrate_digger: false, jumper: false,
    description: 'Best algae-eating snail; cannot breed in freshwater.',
  },
];

export class FishSpeciesSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const data of SPECIES_DATA) {
      const found = await em.findOne(FishSpecies, { name_en: data.name_en });
      if (found) continue;

      const species = new FishSpecies();
      Object.assign(species, { flow_preference: 'moderate', ...data });
      em.persist(species);
    }
    await em.flush();
    console.log(`Seeded ${SPECIES_DATA.length} fish species`);
  }
}
