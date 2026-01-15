import { Module } from '@nestjs/common';
import { FishSpeciesController } from '@presentation/controllers/fish-species.controller';
import { FishSpeciesService } from '@application/services/fish-species.service';
import { FishSyncService } from '@application/services/fish-sync.service';
import { FishSpeciesRepository } from '@infrastructure/repositories/fish-species.repository';
import { FishBaseService } from '@infrastructure/external/fishbase.service';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Module({
  controllers: [FishSpeciesController],
  providers: [
    FishSpeciesService,
    FishSyncService,
    FishSpeciesRepository,
    FishBaseService,
    PrismaService
  ],
  exports: [FishSpeciesService],
})
export class FishSpeciesModule { }
