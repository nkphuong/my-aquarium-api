import { Module } from '@nestjs/common';
import { FishManager } from './managers/fish.manager';
import { FishAccessor } from './accessors/fish.accessor';
import { FISH_ACCESSOR } from './accessors/fish.accessor.interface';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    FishManager,
    {
      provide: FISH_ACCESSOR,
      useClass: FishAccessor,
    },
  ],
  exports: [FISH_ACCESSOR, FishManager],
})
export class FishModule { }
