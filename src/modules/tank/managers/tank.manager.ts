import { Injectable, Inject } from '@nestjs/common';
import { CreateTankRequest, UpdateTankRequest } from '../requests/tank.request';
import { PaginatedResult } from '@core/types/pagination';
import { Tank } from '../entities/tank.entity';
import { EntityNotFoundException } from '@core/exceptions/domain.exception';
import type { ITankAccessor } from '../accessors/tank.accessor.interface';
import { TANK_ACCESSOR } from '../accessors/tank.accessor.interface';

@Injectable()
export class TankManager {
    constructor(
        @Inject(TANK_ACCESSOR) private readonly tankAccessor: ITankAccessor,
    ) { }

    async create(dto: CreateTankRequest, userId: number): Promise<Tank> {
        const tank = new Tank();
        tank.fill({
            name: dto.name,
            length: dto.length,
            width: dto.width,
            height: dto.height,
            volume_liters: dto.volume_liters,
            tank_type: dto.tank_type,
            style: dto.style,
            description: dto.description,
            setup_date: dto.setup_date,
            cover_image_url: dto.cover_image_url,
            substrate: dto.substrate,
            filter_type: dto.filter_type,
            is_archived: false,
        } as any);

        tank.assignToUser(userId);

        const saved = await this.tankAccessor.save(tank);
        return saved;
    }

    async findAll(
        page: number,
        perPage: number,
        includeArchived: boolean = false,
    ): Promise<PaginatedResult<Tank>> {
        const paginatedTanks = await this.tankAccessor.findAll(page, perPage, includeArchived);
        return PaginatedResult.create(paginatedTanks.data, paginatedTanks.meta);
    }

    async findById(id: number): Promise<Tank> {
        const tank = await this.tankAccessor.findById(id);
        if (!tank) {
            throw new EntityNotFoundException('Tank', id);
        }
        return tank;
    }

    async findByUserId(userId: number): Promise<Tank[]> {
        const tanks = await this.tankAccessor.findByUserId(userId);
        return tanks;
    }

    async update(id: number, dto: UpdateTankRequest): Promise<Tank> {
        const tank = await this.tankAccessor.findById(id);
        if (!tank) {
            throw new EntityNotFoundException('Tank', id);
        }

        tank.fill({
            name: dto.name ?? tank.name,
            length: dto.length ?? tank.length,
            width: dto.width ?? tank.width,
            height: dto.height ?? tank.height,
            volume_liters: dto.volume_liters ?? tank.volume_liters,
            tank_type: dto.tank_type ?? tank.tank_type,
            style: dto.style ?? tank.style,
            description: dto.description ?? tank.description,
            setup_date: dto.setup_date ?? tank.setup_date,
            cover_image_url: dto.cover_image_url ?? tank.cover_image_url,
            substrate: dto.substrate ?? tank.substrate,
            filter_type: dto.filter_type ?? tank.filter_type,
        } as any);

        const updated = await this.tankAccessor.update(id, tank);
        return updated;
    }

    async archive(id: number): Promise<Tank> {
        const tank = await this.tankAccessor.findById(id);
        if (!tank) {
            throw new EntityNotFoundException('Tank', id);
        }
        tank.archive();
        const updated = await this.tankAccessor.update(id, tank);
        return updated;
    }

    async unarchive(id: number): Promise<Tank> {
        const tank = await this.tankAccessor.findById(id);
        if (!tank) {
            throw new EntityNotFoundException('Tank', id);
        }
        tank.unarchive();
        const updated = await this.tankAccessor.update(id, tank);
        return updated;
    }

    async delete(id: number): Promise<void> {
        const tank = await this.tankAccessor.findById(id);
        if (!tank) {
            throw new EntityNotFoundException('Tank', id);
        }
        await this.tankAccessor.delete(id);
    }

    async assignToUser(tankId: number, userId: number): Promise<Tank> {
        const tank = await this.tankAccessor.findById(tankId);
        if (!tank) {
            throw new EntityNotFoundException('Tank', tankId);
        }

        tank.assignToUser(userId);
        const updated = await this.tankAccessor.update(tankId, tank);
        return updated;
    }

    async removeFromUser(tankId: number): Promise<Tank> {
        const tank = await this.tankAccessor.findById(tankId);
        if (!tank) {
            throw new EntityNotFoundException('Tank', tankId);
        }

        tank.removeFromUser();
        const updated = await this.tankAccessor.update(tankId, tank);
        return updated;
    }
}
