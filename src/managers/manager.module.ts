import { Module } from '@nestjs/common';
import { AccessorsModule } from '@accessors/accessors.module';
import { AquariumManager } from './aquarium.manager';
import { EnginesModule } from '@engines/engines.module';
import { InventoryManager } from './inventory.manager';
import { WaterLabManager } from './water-lab.manager';
import { MediaManager } from './media.manager';
import { AuthManager } from './auth.manager';
@Module({
  imports: [
    AccessorsModule,
    EnginesModule,
  ],
  providers: [AuthManager, AquariumManager, InventoryManager, WaterLabManager, MediaManager],
  exports: [AuthManager, AquariumManager, InventoryManager, WaterLabManager, MediaManager],
})
export class ManagerModule { }
