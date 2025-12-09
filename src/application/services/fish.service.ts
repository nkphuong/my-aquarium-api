import { Injectable } from '@nestjs/common';
import { FishRepository } from '@infrastructure/repositories/fish.repository';
import { CreateFishDto, UpdateFishDto, FishDto } from '@application/dtos/fish.dto';
import { Fish } from '@domain/entities/fish.entity';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class FishService {
  constructor(private readonly fishRepository: FishRepository) {}

  async create(dto: CreateFishDto): Promise<FishDto> {
    const fish = new Fish(0, dto.name, dto.species);
    const saved = await this.fishRepository.save(fish);
    return FishDto.fromEntity(saved);
  }

  async findAll(): Promise<FishDto[]> {
    const fishes = await this.fishRepository.findAll();
    return FishDto.fromEntities(fishes);
  }

  async findById(id: number): Promise<FishDto> {
    const fish = await this.fishRepository.findById(id);
    if (!fish) {
      throw new EntityNotFoundException('Fish', id);
    }
    return FishDto.fromEntity(fish);
  }

  async findBySpecies(species: string): Promise<FishDto[]> {
    const fishes = await this.fishRepository.findBySpecies(species);
    return FishDto.fromEntities(fishes);
  }

  async update(id: number, dto: UpdateFishDto): Promise<FishDto> {
    const fish = await this.fishRepository.findById(id);
    if (!fish) {
      throw new EntityNotFoundException('Fish', id);
    }

    if (dto.name) fish.updateName(dto.name);
    if (dto.species) fish.updateSpecies(dto.species);

    const updated = await this.fishRepository.update(id, fish);
    return FishDto.fromEntity(updated);
  }

  async delete(id: number): Promise<void> {
    const fish = await this.fishRepository.findById(id);
    if (!fish) {
      throw new EntityNotFoundException('Fish', id);
    }
    await this.fishRepository.delete(id);
  }

  async assignToTank(fishId: number, tankId: number): Promise<FishDto> {
    const fish = await this.fishRepository.findById(fishId);
    if (!fish) {
      throw new EntityNotFoundException('Fish', fishId);
    }

    fish.assignToTank(tankId);
    const updated = await this.fishRepository.update(fishId, fish);
    return FishDto.fromEntity(updated);
  }

  async removeFromTank(fishId: number): Promise<FishDto> {
    const fish = await this.fishRepository.findById(fishId);
    if (!fish) {
      throw new EntityNotFoundException('Fish', fishId);
    }

    fish.removeFromTank();
    const updated = await this.fishRepository.update(fishId, fish);
    return FishDto.fromEntity(updated);
  }
}
