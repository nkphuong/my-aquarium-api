import { Injectable } from '@nestjs/common';
import { UseCase } from '@application/use-cases/base.use-case';
import { CreateFishDto, FishDto } from '@application/dtos/fish.dto';
import { FishRepository } from '@infrastructure/repositories/fish.repository';
import { Fish } from '@domain/entities/fish.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateFishUseCase implements UseCase<CreateFishDto, FishDto> {
  constructor(
    private readonly fishRepository: FishRepository,
  ) {}

  async execute(input: CreateFishDto): Promise<FishDto> {
    const fish = new Fish(
      0,
      input.name,
      input.species,
    );

    const savedFish = await this.fishRepository.save(fish);

    return {
      id: savedFish.id,
      name: savedFish.name,
      species: savedFish.species,
      createdAt: savedFish.createdAt,
      updatedAt: savedFish.updatedAt,
    };
  }
}
