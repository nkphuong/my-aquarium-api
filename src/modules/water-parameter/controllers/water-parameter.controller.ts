import {
    Body, Controller, Post, Get, Param, Delete, UseGuards,
    Query, ParseIntPipe
} from '@nestjs/common';
import { ResponseDto } from '@core/dto/response.dto';
import { WaterParameterManager } from '../managers/water-parameter.manager';
import { CreateWaterParameterRequest } from '../requests/water-parameter.request';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { WaterParameterResource } from '../resources/water-parameter.resource';

@Controller('water-parameter')
@UseGuards(JwtAuthGuard)
export class WaterParameterController {
    constructor(private readonly waterParameterManager: WaterParameterManager) { }

    @Post()
    async create(@Body() createDto: CreateWaterParameterRequest) {
        const item = await this.waterParameterManager.create(createDto);
        return ResponseDto.success(new WaterParameterResource(item), 'Water parameter recorded successfully');
    }

    @Get()
    async findByTank(@Query('tankId', ParseIntPipe) tankId: number) {
        const items = await this.waterParameterManager.findByTankId(tankId);
        return ResponseDto.success(WaterParameterResource.collection(items));
    }

    @Get('latest')
    async findLatestByTank(@Query('tankId', ParseIntPipe) tankId: number) {
        const item = await this.waterParameterManager.findLatestByTankId(tankId);
        return ResponseDto.success(item ? new WaterParameterResource(item) : null);
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        const item = await this.waterParameterManager.findById(id);
        return ResponseDto.success(new WaterParameterResource(item));
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.waterParameterManager.delete(id);
        return ResponseDto.success(null, 'Water parameter deleted successfully');
    }
}
