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
        try {
            const item = await this.livestockManager.create(createLivestockDto);
            return ResponseDto.success(new LivestockResource(item), 'Livestock added successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get()
    async findByTank(@Query('tankId', ParseIntPipe) tankId: number) {
        try {
            const items = await this.livestockManager.findByTankId(tankId);
            return ResponseDto.success(LivestockResource.collection(items));
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        try {
            const item = await this.livestockManager.findById(id);
            return ResponseDto.success(new LivestockResource(item));
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateLivestockDto: UpdateLivestockRequest,
    ) {
        try {
            const item = await this.livestockManager.update(id, updateLivestockDto);
            return ResponseDto.success(new LivestockResource(item), 'Livestock updated successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.livestockManager.delete(id);
            return ResponseDto.success(null, 'Livestock removed successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }
}
