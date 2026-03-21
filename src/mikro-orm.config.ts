import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { Logger } from '@nestjs/common';
import 'dotenv/config';

const logger = new Logger('MikroORM');

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  logger: (msg: string) => logger.log(msg),
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
  },
  seeder: {
    path: 'dist/database/seeders',
    pathTs: 'src/database/seeders',
  },
});
