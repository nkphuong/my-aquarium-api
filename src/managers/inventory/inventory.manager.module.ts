import { Module } from '@nestjs/common';
import { InventoryManager } from './managers/inventory.manager';
import { LivestockController } from './controllers/livestock.controller';
import { FishSpeciesController } from './controllers/fish-species.controller';
import { LivestockAccessorModule } from '@accessors/livestock/livestock.accessor.module';
import { AquariumAccessorModule } from '@accessors/aquarium/aquarium.accessor.module';

@Module({
  imports: [LivestockAccessorModule, AquariumAccessorModule],
  controllers: [LivestockController, FishSpeciesController],
  providers: [InventoryManager],
  exports: [InventoryManager],
})
export class InventoryManagerModule {}
