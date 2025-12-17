import { Module } from '@nestjs/common';
import { FishSpeciesController } from '@presentation/controllers/fish-species.controller';
import { FishSpeciesRepository } from '@infrastructure/repositories/fish-species.repository';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule], // Required for JwtAuthGuard
  controllers: [FishSpeciesController],
  providers: [FishSpeciesRepository],
  exports: [FishSpeciesRepository],
})
export class FishSpeciesModule {}
