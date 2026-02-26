import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Fish } from './entities/fish.entity';
import { FishSpecies } from './entities/fish-species.entity';
import { Livestock } from './entities/livestock.entity';
import { FISH_ACCESSOR } from './accessors/fish.accessor.interface';
import { FishAccessor } from './accessors/fish.accessor';
import { FISH_SPECIES_ACCESSOR } from './accessors/fish-species.accessor.interface';
import { FishSpeciesAccessor } from './accessors/fish-species.accessor';
import { LIVESTOCK_ACCESSOR } from './accessors/livestock.accessor.interface';
import { LivestockAccessor } from './accessors/livestock.accessor';

@Module({
  imports: [MikroOrmModule.forFeature([Fish, FishSpecies, Livestock])],
  providers: [
    {
      provide: FISH_ACCESSOR,
      useClass: FishAccessor,
    },
    {
      provide: FISH_SPECIES_ACCESSOR,
      useClass: FishSpeciesAccessor,
    },
    {
      provide: LIVESTOCK_ACCESSOR,
      useClass: LivestockAccessor,
    },
  ],
  exports: [FISH_ACCESSOR, FISH_SPECIES_ACCESSOR, LIVESTOCK_ACCESSOR],
})
export class LivestockAccessorModule {}
