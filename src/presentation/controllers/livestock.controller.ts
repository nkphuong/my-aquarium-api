import {
    Body, Controller, Post, Get, Param, Patch, Delete, UseGuards,
    Query, ParseIntPipe
} from '@nestjs/common';
import { ResponseDto } from '@presentation/dto/response.dto';
import { LivestockService } from '@application/services/livestock.service';
import { CreateLivestockDto, UpdateLivestockDto } from '@application/dtos/livestock.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';

@Controller('livestock')
@UseGuards(JwtAuthGuard)
export class LivestockController {
    constructor(private readonly livestockService: LivestockService) { }

    @Post()
    async create(@Body() createLivestockDto: CreateLivestockDto) {
        try {
            const item = await this.livestockService.create(createLivestockDto);
            return ResponseDto.success(item, 'Livestock added successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get()
    async findByTank(@Query('tankId', ParseIntPipe) tankId: number) {
        try {
            const items = await this.livestockService.findByTankId(tankId);
            return ResponseDto.success(items);
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        try {
            const item = await this.livestockService.findById(id);
            return ResponseDto.success(item);
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateLivestockDto: UpdateLivestockDto,
    ) {
        try {
            const item = await this.livestockService.update(id, updateLivestockDto);
            return ResponseDto.success(item, 'Livestock updated successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.livestockService.delete(id);
            return ResponseDto.success(null, 'Livestock removed successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }
}
