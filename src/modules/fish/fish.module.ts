import { Module } from '@nestjs/common';
import { FishController } from '@presentation/controllers/fish.controller';
import { CreateFishUseCase } from '@application/use-cases/fish/create-fish.use-case';
import { GetAllFishUseCase } from '@application/use-cases/fish/get-all-fish.use-case';
import { FishRepository } from '@infrastructure/repositories/fish.repository';

@Module({
  controllers: [FishController],
  providers: [
    CreateFishUseCase,
    GetAllFishUseCase,
    FishRepository,
  ],
})
export class FishModule {}
