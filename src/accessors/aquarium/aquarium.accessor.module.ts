import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tank } from './entities/tank.entity';
import { WaterParameter } from './entities/water-parameter.entity';
import { TANK_ACCESSOR } from './accessors/tank.accessor.interface';
import { TankAccessor } from './accessors/tank.accessor';
import { WATER_PARAMETER_ACCESSOR } from './accessors/water-parameter.accessor.interface';
import { WaterParameterAccessor } from './accessors/water-parameter.accessor';

@Module({
  imports: [MikroOrmModule.forFeature([Tank, WaterParameter])],
  providers: [
    {
      provide: TANK_ACCESSOR,
      useClass: TankAccessor,
    },
    {
      provide: WATER_PARAMETER_ACCESSOR,
      useClass: WaterParameterAccessor,
    },
  ],
  exports: [TANK_ACCESSOR, WATER_PARAMETER_ACCESSOR],
})
export class AquariumAccessorModule {}
