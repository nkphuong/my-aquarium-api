import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { ResponseDto } from '@core/dto/response.dto';
import { InventoryManager } from '@managers/inventory.manager';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { FishSpeciesResource } from '../resources/fish-species.resource';
import { FishSpeciesCreateRequest } from '../requests/fish-species.create.request';

@Controller('fish-species')
@UseGuards(JwtAuthGuard)
export class FishSpeciesController {
  constructor(private readonly inventoryManager: InventoryManager) { }

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

  @Post()
  async create(@Body() dto: FishSpeciesCreateRequest) {
    const item = await this.inventoryManager.createFishSpecies(dto);
    return ResponseDto.success(new FishSpeciesResource(item));
  }
}
