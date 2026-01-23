import {
    Body, Controller, Post, Get, Param, Patch, Delete, UseGuards,
    Query, ParseIntPipe
} from '@nestjs/common';
import { ResponseDto } from '@core/dto/response.dto';
import { LivestockManager } from '../managers/livestock.manager';
import { CreateLivestockRequest, UpdateLivestockRequest } from '../requests/livestock.request';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { LivestockResource } from '../resources/livestock.resource';

@Controller('livestock')
@UseGuards(JwtAuthGuard)
export class LivestockController {
    constructor(private readonly livestockManager: LivestockManager) { }

    @Post()
    async create(@Body() createLivestockDto: CreateLivestockRequest) {
        const item = await this.livestockManager.create(createLivestockDto);
        return ResponseDto.success(new LivestockResource(item), 'Livestock added successfully');
    }

    @Get()
    async findByTank(@Query('tankId', ParseIntPipe) tankId: number) {
        const items = await this.livestockManager.findByTankId(tankId);
        return ResponseDto.success(LivestockResource.collection(items));
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        const item = await this.livestockManager.findById(id);
        return ResponseDto.success(new LivestockResource(item));
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateLivestockDto: UpdateLivestockRequest,
    ) {
        const item = await this.livestockManager.update(id, updateLivestockDto);
        return ResponseDto.success(new LivestockResource(item), 'Livestock updated successfully');
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.livestockManager.delete(id);
        return ResponseDto.success(null, 'Livestock removed successfully');
    }
}
