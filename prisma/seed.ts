import { seedFishSpecies } from './seed-data/fish-species.seed';

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Seed fish species
  await seedFishSpecies();

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
