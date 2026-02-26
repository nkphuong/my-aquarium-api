import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ResponseDto } from '@core/dto/response.dto';
import { InventoryManager } from '../../inventory/managers/inventory.manager';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { FishSpeciesResource } from '../resources/fish-species.resource';

@Controller('fish-species')
@UseGuards(JwtAuthGuard)
export class FishSpeciesController {
  constructor(private readonly inventoryManager: InventoryManager) {}

  @Get()
  async findAll(@Query('keyword') keyword?: string) {
    const items = await this.inventoryManager.findAllFishSpecies(keyword);
    return ResponseDto.success(FishSpeciesResource.collection(items));
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const item = await this.inventoryManager.findFishSpeciesById(id);
    return ResponseDto.success(new FishSpeciesResource(item));
  }
}
