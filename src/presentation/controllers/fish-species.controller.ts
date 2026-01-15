import {
  Controller, Get, Post, Param, Query, UseGuards, ParseIntPipe
} from '@nestjs/common';
import { ResponseDto } from '@presentation/dto/response.dto';
import { FishSpeciesService } from '@application/services/fish-species.service';
import { FishSyncService } from '@application/services/fish-sync.service';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';

@Controller('species')
export class FishSpeciesController {
  constructor(
    private readonly fishSpeciesService: FishSpeciesService,
    private readonly fishSyncService: FishSyncService,
  ) { }

  @Get()
  async findAll(@Query('keyword') keyword?: string) {
    try {
      const items = await this.fishSpeciesService.findAll(keyword);
      return ResponseDto.success(items);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    try {
      const item = await this.fishSpeciesService.findById(id);
      return ResponseDto.success(item);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  // Admin only in real world, but open for now (or protected)
  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async sync() {
    try {
      const result = await this.fishSyncService.syncAll();
      return ResponseDto.success(result, 'Synchronization started/completed');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }
}
