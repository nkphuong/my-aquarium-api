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
        try {
            const item = await this.waterParameterManager.create(createDto);
            return ResponseDto.success(new WaterParameterResource(item), 'Water parameter recorded successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get()
    async findByTank(@Query('tankId', ParseIntPipe) tankId: number) {
        try {
            const items = await this.waterParameterManager.findByTankId(tankId);
            return ResponseDto.success(WaterParameterResource.collection(items));
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get('latest')
    async findLatestByTank(@Query('tankId', ParseIntPipe) tankId: number) {
        try {
            const item = await this.waterParameterManager.findLatestByTankId(tankId);
            return ResponseDto.success(item ? new WaterParameterResource(item) : null);
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        try {
            const item = await this.waterParameterManager.findById(id);
            return ResponseDto.success(new WaterParameterResource(item));
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.waterParameterManager.delete(id);
            return ResponseDto.success(null, 'Water parameter deleted successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }
}
