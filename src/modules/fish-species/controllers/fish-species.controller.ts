import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ResponseDto } from '@core/dto/response.dto';
import { FishSpeciesManager } from '../managers/fish-species.manager';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { FishSpeciesResource } from '../resources/fish-species.resource';

@Controller('fish-species')
@UseGuards(JwtAuthGuard)
export class FishSpeciesController {
    constructor(private readonly fishSpeciesManager: FishSpeciesManager) { }

    @Get()
    async findAll(@Query('keyword') keyword?: string) {
        try {
            const items = await this.fishSpeciesManager.findAll(keyword);
            return ResponseDto.success(FishSpeciesResource.collection(items));
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        try {
            const item = await this.fishSpeciesManager.findById(id);
            return ResponseDto.success(new FishSpeciesResource(item));
        } catch (error) {
            return ResponseDto.error(error.message);
        }
    }
}
