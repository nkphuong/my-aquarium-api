import { Injectable } from '@nestjs/common';
import { TankRepository } from '@infrastructure/repositories/tank.repository';
import { CreateTankDto, UpdateTankDto, TankDto } from '@application/dtos/tank.dto';
import { Tank } from '@domain/entities/tank.entity';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class TankService {
  constructor(private readonly tankRepository: TankRepository) {}

  async create(dto: CreateTankDto, userId: number): Promise<TankDto> {
    const tank = new Tank(
      0,
      dto.name,
      dto.width,
      dto.height,
      dto.length,
      userId,
    );

    const saved = await this.tankRepository.save(tank);
    return TankDto.fromEntity(saved);
  }

  async findAll(): Promise<TankDto[]> {
    const tanks = await this.tankRepository.findAll();
    return TankDto.fromEntities(tanks);
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
    if (dto.width !== undefined && dto.height !== undefined && dto.length !== undefined) {
      tank.updateDimensions(dto.width, dto.height, dto.length);
    }

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
