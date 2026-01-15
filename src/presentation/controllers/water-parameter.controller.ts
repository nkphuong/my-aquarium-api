import {
    Body, Controller, Post, Get, Param, Delete, UseGuards,
    ParseIntPipe
} from '@nestjs/common';
import { ResponseDto } from '@presentation/dto/response.dto';
import { WaterParameterService } from '@application/services/water-parameter.service';
import { CreateWaterParameterDto } from '@application/dtos/water-parameter.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class WaterParameterController {
    constructor(private readonly service: WaterParameterService) { }

    @Post('tanks/:tankId/parameters')
    async create(
        @Param('tankId', ParseIntPipe) tankId: number,
        @Body() dto: CreateWaterParameterDto
    ) {
        try {
            if (dto.tankId !== tankId) {
                dto.tankId = tankId;
            }
            const item = await this.service.create(dto);
            return ResponseDto.success(item, 'Water parameter log added successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get('tanks/:tankId/parameters')
    async findByTank(@Param('tankId', ParseIntPipe) tankId: number) {
        try {
            const items = await this.service.findByTankId(tankId);
            return ResponseDto.success(items);
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get('tanks/:tankId/parameters/latest')
    async findLatest(@Param('tankId', ParseIntPipe) tankId: number) {
        try {
            const item = await this.service.findLatestByTankId(tankId);
            return ResponseDto.success(item);
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Delete('parameters/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.service.delete(id);
            return ResponseDto.success(null, 'Water parameter log removed successfully');
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }
}
