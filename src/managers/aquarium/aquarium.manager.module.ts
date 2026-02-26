import { Module } from '@nestjs/common';
import { AquariumManager } from './managers/aquarium.manager';
import { TankController } from './controllers/tank.controller';
import { AquariumAccessorModule } from '@accessors/aquarium/aquarium.accessor.module';
import { LivestockAccessorModule } from '@accessors/livestock/livestock.accessor.module';
import { EnginesModule } from '../../engines/engines.module';

@Module({
  imports: [AquariumAccessorModule, LivestockAccessorModule, EnginesModule],
  controllers: [TankController],
  providers: [AquariumManager],
  exports: [AquariumManager],
})
export class AquariumManagerModule {}
