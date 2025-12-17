import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample fish species data - you can expand this
const fishSpeciesSeedData = [
  {
    name_en: 'Neon Tetra',
    name_vn: 'Cá Neon',
    scientific_name: 'Paracheirodon innesi',
    aliases: ['Cardinal Tetra'],
    image_url: null,
    temp_min: 20,
    temp_max: 26,
    ph_min: 6.0,
    ph_max: 7.0,
    gh_min: 1,
    gh_max: 10,
    min_tank_size: 40, // liters
    size_max: 4, // cm
    bioload_level: 3,
    flow_preference: 'Moderate',
    care_level: 'Easy',
    temperament: 'Peaceful',
    diet_type: 'Omnivore',
    is_schooling: true,
    min_school_size: 6,
    plant_safe: true,
    substrate_digger: false,
    jumper: false,
    description:
      'The Neon Tetra is one of the most popular freshwater aquarium fish. Native to blackwater streams in South America, they are known for their vibrant blue and red coloration. They are peaceful schooling fish that do best in groups of 6 or more. They prefer soft, slightly acidic water and densely planted tanks with moderate lighting.',
  },
  {
    name_en: 'Betta Fish',
    name_vn: 'Cá Xiêm',
    scientific_name: 'Betta splendens',
    aliases: ['Siamese Fighting Fish'],
    image_url: null,
    temp_min: 24,
    temp_max: 28,
    ph_min: 6.5,
    ph_max: 7.5,
    gh_min: 5,
    gh_max: 15,
    min_tank_size: 20, // liters
    size_max: 7, // cm
    bioload_level: 4,
    flow_preference: 'Slow',
    care_level: 'Easy',
    temperament: 'Aggressive',
    diet_type: 'Carnivore',
    is_schooling: false,
    min_school_size: 1,
    plant_safe: true,
    substrate_digger: false,
    jumper: true,
    description:
      'Betta fish are known for their vibrant colors and flowing fins. Male bettas are highly territorial and should be kept alone or with peaceful tank mates. They prefer warm water with low flow as they come from rice paddies and slow-moving streams in Southeast Asia. They are labyrinth fish that can breathe air from the surface.',
  },
  {
    name_en: 'Corydoras Catfish',
    name_vn: 'Cá Chuột Corydoras',
    scientific_name: 'Corydoras paleatus',
    aliases: ['Cory Cat', 'Peppered Cory'],
    image_url: null,
    temp_min: 22,
    temp_max: 26,
    ph_min: 6.5,
    ph_max: 7.5,
    gh_min: 2,
    gh_max: 15,
    min_tank_size: 60, // liters
    size_max: 6, // cm
    bioload_level: 4,
    flow_preference: 'Moderate',
    care_level: 'Easy',
    temperament: 'Peaceful',
    diet_type: 'Omnivore',
    is_schooling: true,
    min_school_size: 6,
    plant_safe: true,
    substrate_digger: true,
    jumper: false,
    description:
      'Corydoras catfish are peaceful bottom-dwelling fish that help keep the substrate clean by scavenging for leftover food. They are social fish that should be kept in groups of 6 or more. They prefer soft sand substrate as they use their barbels to search for food and can damage them on sharp gravel.',
  },
  {
    name_en: 'Guppy',
    name_vn: 'Cá Bảy Màu',
    scientific_name: 'Poecilia reticulata',
    aliases: ['Millionfish', 'Rainbow Fish'],
    image_url: null,
    temp_min: 22,
    temp_max: 28,
    ph_min: 6.8,
    ph_max: 7.8,
    gh_min: 8,
    gh_max: 12,
    min_tank_size: 40, // liters
    size_max: 6, // cm
    bioload_level: 3,
    flow_preference: 'Moderate',
    care_level: 'Easy',
    temperament: 'Peaceful',
    diet_type: 'Omnivore',
    is_schooling: false,
    min_school_size: 3,
    plant_safe: true,
    substrate_digger: false,
    jumper: false,
    description:
      'Guppies are extremely popular due to their ease of care, vibrant colors, and prolific breeding. Males are smaller and more colorful than females. They are livebearers and can reproduce rapidly in home aquariums. They prefer slightly hard, alkaline water and do well in community tanks with other peaceful species.',
  },
  {
    name_en: 'Angelfish',
    name_vn: 'Cá Thần Tiên',
    scientific_name: 'Pterophyllum scalare',
    aliases: ['Freshwater Angelfish'],
    image_url: null,
    temp_min: 24,
    temp_max: 28,
    ph_min: 6.0,
    ph_max: 7.5,
    gh_min: 3,
    gh_max: 10,
    min_tank_size: 200, // liters
    size_max: 15, // cm
    bioload_level: 7,
    flow_preference: 'Slow',
    care_level: 'Medium',
    temperament: 'Semi-Aggressive',
    diet_type: 'Omnivore',
    is_schooling: false,
    min_school_size: 1,
    plant_safe: true,
    substrate_digger: false,
    jumper: false,
    description:
      'Angelfish are elegant South American cichlids with distinctive triangular shape and long fins. They can be territorial, especially when breeding, and may eat very small fish. They prefer tall tanks with plenty of vertical swimming space and appreciate densely planted areas. Adults can be kept in pairs or groups in larger tanks.',
  },
  {
    name_en: 'Cherry Shrimp',
    name_vn: 'Tôm Đỏ Cherry',
    scientific_name: 'Neocaridina davidi',
    aliases: ['Red Cherry Shrimp', 'RCS'],
    image_url: null,
    temp_min: 20,
    temp_max: 26,
    ph_min: 6.5,
    ph_max: 8.0,
    gh_min: 6,
    gh_max: 15,
    min_tank_size: 20, // liters
    size_max: 3, // cm
    bioload_level: 1,
    flow_preference: 'Slow',
    care_level: 'Easy',
    temperament: 'Peaceful',
    diet_type: 'Omnivore',
    is_schooling: false,
    min_school_size: 5,
    plant_safe: true,
    substrate_digger: false,
    jumper: false,
    description:
      'Cherry shrimp are hardy freshwater shrimp popular for their bright red coloration and algae-eating abilities. They are excellent for planted tanks and help control algae. They breed readily in aquariums and are safe with most peaceful fish, though larger fish may eat them. They prefer stable water parameters.',
  },
];

async function seedFishSpecies() {
  console.log('Seeding fish species...');

  for (const species of fishSpeciesSeedData) {
    try {
      const created = await prisma.fishSpecies.create({
        data: species,
      });
      console.log(`✓ Created: ${created.name_en}`);
    } catch (error) {
      console.error(`✗ Failed to create ${species.name_en}:`, error);
    }
  }

  console.log('Fish species seeding completed!');
}

export { seedFishSpecies };

// Run if executed directly
if (require.main === module) {
  seedFishSpecies()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
