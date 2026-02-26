import { Module } from '@nestjs/common';
import { WaterLabManager } from './managers/water-lab.manager';
import { WaterParameterController } from './controllers/water-parameter.controller';
import { AquariumAccessorModule } from '@accessors/aquarium/aquarium.accessor.module';

@Module({
  imports: [AquariumAccessorModule],
  controllers: [WaterParameterController],
  providers: [WaterLabManager],
  exports: [WaterLabManager],
})
export class WaterLabManagerModule {}
