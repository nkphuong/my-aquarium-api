import { Injectable } from '@nestjs/common';
import { UseCase } from '@application/use-cases/base.use-case';
import { FishDto } from '@application/dtos/fish.dto';
import { FishRepository } from '@infrastructure/repositories/fish.repository';

@Injectable()
export class GetAllFishUseCase implements UseCase<void, FishDto[]> {
  constructor(
    private readonly fishRepository: FishRepository,
  ) {}

  async execute(): Promise<FishDto[]> {
    const fishes = await this.fishRepository.findAll();

    return fishes.map((fish) => ({
      id: fish.id,
      name: fish.name,
      species: fish.species,
      createdAt: fish.createdAt,
      updatedAt: fish.updatedAt,
    }));
  }
}
