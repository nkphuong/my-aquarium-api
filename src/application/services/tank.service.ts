import { Injectable } from '@nestjs/common';
import { TankRepository } from '@infrastructure/repositories/tank.repository';
import { CreateTankDto, UpdateTankDto, TankDto } from '@application/dtos/tank.dto';
import { PaginatedResult } from '@application/dtos/pagination.dto';
import { Tank } from '@domain/entities/tank.entity';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';
import { TankDimensions } from '@domain/enums/tank.enum';

@Injectable()
export class TankService {
  constructor(private readonly tankRepository: TankRepository) { }

  async create(dto: CreateTankDto, userId: number): Promise<TankDto> {
    // Transform DTO dimensions to Entity dimensions interface
    let dimensions: TankDimensions | undefined;
    if (dto.dimensions) {
      dimensions = {
        length: dto.dimensions.length,
        width: dto.dimensions.width,
        height: dto.dimensions.height,
      };
    }

    const tank = new Tank(
      0, // ID provided by DB
      dto.name,
      dimensions,
      dto.tank_type,
      dto.style,
      dto.description,
      dto.setup_date,
      dto.volume_liters,
      dto.cover_image_url,
      dto.substrate,
      dto.filter_type,
      false, // is_archived default
      userId,
    );

    const saved = await this.tankRepository.save(tank);
    return TankDto.fromEntity(saved);
  }

  async findAll(page: number, perPage: number, includeArchived: boolean = false): Promise<PaginatedResult<TankDto>> {
    const paginatedTanks = await this.tankRepository.findAll(page, perPage, includeArchived);
    const tankDtos = TankDto.fromEntities(paginatedTanks.data);
    return PaginatedResult.create(tankDtos, paginatedTanks.meta);
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
    return TankDto.fromEntities(tanks);
  }

  async update(id: number, dto: UpdateTankDto): Promise<TankDto> {
    const tank = await this.tankRepository.findById(id);
    if (!tank) {
      throw new EntityNotFoundException('Tank', id);
    }

    if (dto.name) tank.updateName(dto.name);
    if (dto.dimensions) {
      tank.updateDimensions({
        length: dto.dimensions.length,
        width: dto.dimensions.width,
        height: dto.dimensions.height,
      });
    }
    if (dto.tank_type !== undefined) tank.updateTankType(dto.tank_type);
    if (dto.style !== undefined) tank.updateStyle(dto.style);
    if (dto.description !== undefined) tank.updateDescription(dto.description);
    if (dto.setup_date !== undefined) tank.updateSetupDate(dto.setup_date);
    if (dto.volume_liters !== undefined) tank.updateVolumeLiters(dto.volume_liters);
    if (dto.cover_image_url !== undefined) tank.updateCoverImageUrl(dto.cover_image_url);
    if (dto.substrate !== undefined) tank.updateSubstrate(dto.substrate);
    if (dto.filter_type !== undefined) tank.updateFilterType(dto.filter_type);

    const updated = await this.tankRepository.update(id, tank);
    return TankDto.fromEntity(updated);
  }

  async archive(id: number): Promise<TankDto> {
    const tank = await this.tankRepository.findById(id);
    if (!tank) {
      throw new EntityNotFoundException('Tank', id);
    }
    tank.archive();
    const updated = await this.tankRepository.update(id, tank);
    return TankDto.fromEntity(updated);
  }

  async unarchive(id: number): Promise<TankDto> {
    const tank = await this.tankRepository.findById(id);
    if (!tank) {
      throw new EntityNotFoundException('Tank', id);
    }
    tank.unarchive();
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
