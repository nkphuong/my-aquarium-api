import {
  Body, Controller, Post, Get, Param, Patch, Delete, UseGuards,
  Query, ParseIntPipe, DefaultValuePipe, ParseBoolPipe
} from '@nestjs/common';
import { ResponseDto } from '@presentation/dto/response.dto';
import { TankService } from '@application/services/tank.service';
import { CreateTankDto, UpdateTankDto } from '@application/dtos/tank.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { UserDto } from '@application/dtos/auth.dto';

@Controller('tank')
@UseGuards(JwtAuthGuard) // Require authentication for all tank routes
export class TankController {
  constructor(private readonly tankService: TankService) { }

  @Post()
  async create(
    @Body() createTankDto: CreateTankDto,
    @CurrentUser() user: UserDto,
  ) {
    try {
      const tank = await this.tankService.create(createTankDto, user.id);
      return ResponseDto.success(tank, 'Tank created successfully');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    @Query('includeArchived', new DefaultValuePipe(false), ParseBoolPipe) includeArchived: boolean,
  ) {
    try {
      const tanks = await this.tankService.findAll(page, perPage, includeArchived);
      return ResponseDto.success(tanks);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Get('my-tanks')
  async findMyTanks(
    @CurrentUser() user: UserDto) {
    try {
      const tanks = await this.tankService.findByUserId(user.id);
      return ResponseDto.success(tanks);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const tank = await this.tankService.findById(id);
      return ResponseDto.success(tank);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTankDto: UpdateTankDto,
  ) {
    try {
      const tank = await this.tankService.update(id, updateTankDto);
      return ResponseDto.success(tank, 'Tank updated successfully');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: number) {
    try {
      const tank = await this.tankService.archive(id);
      return ResponseDto.success(tank, 'Tank archived successfully');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Patch(':id/unarchive')
  async unarchive(@Param('id') id: number) {
    try {
      const tank = await this.tankService.unarchive(id);
      return ResponseDto.success(tank, 'Tank unarchived successfully');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      await this.tankService.delete(id);
      return ResponseDto.success(null, 'Tank deleted successfully');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }
}
