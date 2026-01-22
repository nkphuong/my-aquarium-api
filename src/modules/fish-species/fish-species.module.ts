import { Module } from '@nestjs/common';
import { FishSpeciesController } from './controllers/fish-species.controller';
import { FishSpeciesManager } from './managers/fish-species.manager';
import { FishSpeciesAccessor } from './accessors/fish-species.accessor';
import { FISH_SPECIES_ACCESSOR } from './accessors/fish-species.accessor.interface';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FishSpeciesController],
  providers: [
    FishSpeciesManager,
    {
      provide: FISH_SPECIES_ACCESSOR,
      useClass: FishSpeciesAccessor,
    },
  ],
  exports: [FISH_SPECIES_ACCESSOR, FishSpeciesManager],
})
export class FishSpeciesModule { }
