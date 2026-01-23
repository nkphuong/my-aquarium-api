import { Body, Controller, Post, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ResponseDto } from '@core/dto/response.dto';
import { TankManager } from '../managers/tank.manager';
import { CreateTankRequest, UpdateTankRequest } from '../requests/tank.request';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@modules/auth/entities/user.entity';
import { TankResource } from '../resources/tank.resource';
import { PaginatedResult } from '@core/types/pagination';

@Controller('tank')
@UseGuards(JwtAuthGuard)
export class TankController {
    constructor(private readonly tankManager: TankManager) { }

    @Post()
    async create(
        @Body() createTankDto: CreateTankRequest,
        @CurrentUser() user: User,
    ) {
        const tank = await this.tankManager.create(createTankDto, user.id!);
        return ResponseDto.success(new TankResource(tank), 'Tank created successfully');
    }

    @Get()
    async findAll(@CurrentUser() user: User) {
        const tanks = await this.tankManager.findAll(1, 10);
        const resourceData = TankResource.collection(tanks.items);
        const paginatedResource = PaginatedResult.create(resourceData, tanks.meta);
        return ResponseDto.success(paginatedResource);
    }

    @Get('my-tanks')
    async findMyTanks(@CurrentUser() user: User) {
        const tanks = await this.tankManager.findByUserId(user.id!);
        return ResponseDto.success(TankResource.collection(tanks));
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        const tank = await this.tankManager.findById(id);
        return ResponseDto.success(new TankResource(tank));
    }

    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() updateTankDto: UpdateTankRequest,
    ) {
        const tank = await this.tankManager.update(id, updateTankDto);
        return ResponseDto.success(new TankResource(tank), 'Tank updated successfully');
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.tankManager.delete(id);
        return ResponseDto.success(null, 'Tank deleted successfully');
    }
}
