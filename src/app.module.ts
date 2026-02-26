import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/filters/domain-exception.filter';
import { ConfigModule } from '@nestjs/config';

import { EnginesModule } from './engines/engines.module';

// Data Subsystems
import { LivestockAccessorModule } from './accessors/livestock/livestock.accessor.module';
import { AquariumAccessorModule } from './accessors/aquarium/aquarium.accessor.module';
import { UserAccessorModule } from './accessors/user/user.accessor.module';
import { MediaAccessorModule } from './accessors/media/media.accessor.module';

// Application Workflows
import { AuthManagerModule } from './managers/auth/auth.manager.module';
import { AquariumManagerModule } from './managers/aquarium/aquarium.manager.module';
import { InventoryManagerModule } from './managers/inventory/inventory.manager.module';
import { WaterLabManagerModule } from './managers/water-lab/water-lab.manager.module';
import { MediaManagerModule } from './managers/media/media.manager.module';

import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    DatabaseModule,
    EnginesModule,

    // Data Subsystems
    LivestockAccessorModule,
    AquariumAccessorModule,
    UserAccessorModule,
    MediaAccessorModule,

    // Workflow Applications
    AuthManagerModule,
    AquariumManagerModule,
    InventoryManagerModule,
    WaterLabManagerModule,
    MediaManagerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
