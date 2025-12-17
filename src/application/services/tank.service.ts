import { Injectable } from '@nestjs/common';
import { TankRepository } from '@infrastructure/repositories/tank.repository';
import { CreateTankDto, UpdateTankDto, TankDto } from '@application/dtos/tank.dto';
import { PaginatedResult } from '@application/dtos/pagination.dto';
import { Tank } from '@domain/entities/tank.entity';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class TankService {
  constructor(private readonly tankRepository: TankRepository) { }

  async create(dto: CreateTankDto, userId: number): Promise<TankDto> {
    const tank = new Tank(
      0,
      dto.name,
      dto.width,
      dto.height,
      dto.length,
      dto.type,
      dto.style,
      dto.description,
      dto.status,
      dto.setup_at,
      dto.water_volume,
      dto.avatar,
      userId,
    );

    const saved = await this.tankRepository.save(tank);
    return TankDto.fromEntity(saved);
  }

  async findAll(userId: number, page: number, perPage: number): Promise<PaginatedResult<TankDto>> {
    const paginatedTanks = await this.tankRepository.findByUserId(userId, page, perPage);

    // Type guard to ensure we have PaginatedTanks
    if (!Array.isArray(paginatedTanks) && 'data' in paginatedTanks && 'meta' in paginatedTanks) {
      const tankDtos = TankDto.fromEntities(paginatedTanks.data);
      return PaginatedResult.create(tankDtos, paginatedTanks.meta);
    }

    // This should never happen with the current implementation
    throw new Error('Expected paginated result from repository');
  }

  async findById(id: number): Promise<TankDto> {
    const tank = await this.tankRepository.findById(id);
    if (!tank) {
      throw new EntityNotFoundException('Tank', id);
    }
    return TankDto.fromEntity(tank);
  }

  async findByUserId(userId: number): Promise<TankDto[]> {
    const tanks = await this.tankRepository.findByUserId(userId);

    // Handle the case where repository returns paginated or non-paginated result
    if (Array.isArray(tanks)) {
      return TankDto.fromEntities(tanks);
    }

    // If it returns PaginatedTanks, just use the data
    return TankDto.fromEntities(tanks.data);
  }

  async update(id: number, dto: UpdateTankDto): Promise<TankDto> {
    const tank = await this.tankRepository.findById(id);
    if (!tank) {
      throw new EntityNotFoundException('Tank', id);
    }

    if (dto.name) tank.updateName(dto.name);
    if (dto.width !== undefined && dto.height !== undefined && dto.length !== undefined) {
      tank.updateDimensions(dto.width, dto.height, dto.length);
    }
    if (dto.type !== undefined) tank.updateType(dto.type);
    if (dto.style !== undefined) tank.updateStyle(dto.style);
    if (dto.description !== undefined) tank.updateDescription(dto.description);
    if (dto.status !== undefined) tank.updateStatus(dto.status);
    if (dto.setup_at !== undefined) tank.updateSetupAt(dto.setup_at);
    if (dto.water_volume !== undefined) tank.updateWaterVolume(dto.water_volume);
    if (dto.avatar !== undefined) tank.updateAvatar(dto.avatar);

    const updated = await this.tankRepository.update(id, tank);
    return TankDto.fromEntity(updated);
  }

  async delete(id: number): Promise<void> {
    const tank = await this.tankRepository.findById(id);
    if (!tank) {
      throw new EntityNotFoundException('Tank', id);
    }
    await this.tankRepository.delete(id);
  }

  async assignToUser(tankId: number, userId: number): Promise<TankDto> {
    const tank = await this.tankRepository.findById(tankId);
    if (!tank) {
      throw new EntityNotFoundException('Tank', tankId);
    }

    tank.assignToUser(userId);
    const updated = await this.tankRepository.update(tankId, tank);
    return TankDto.fromEntity(updated);
  }

  async removeFromUser(tankId: number): Promise<TankDto> {
    const tank = await this.tankRepository.findById(tankId);
    if (!tank) {
      throw new EntityNotFoundException('Tank', tankId);
    }

    tank.removeFromUser();
    const updated = await this.tankRepository.update(tankId, tank);
    return TankDto.fromEntity(updated);
  }
}
