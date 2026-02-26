import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTankRequest, UpdateTankRequest } from '../requests/tank.request';
import { ResponseDto } from '@core/dto/response.dto';
import { PaginationParams, PaginatedResult } from '@core/types/pagination';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@accessors/user/entities/user.entity';
import { TankResource } from '../resources/tank.resource';
import { AquariumManager } from '../../aquarium/managers/aquarium.manager';

@Controller('tanks')
@UseGuards(JwtAuthGuard)
export class TankController {
  constructor(private readonly aquariumManager: AquariumManager) {}

  @Post()
  async create(
    @Body() createTankDto: CreateTankRequest,
    @CurrentUser() user: User,
  ) {
    const tank = await this.aquariumManager.createTank(createTankDto, user.id);
    return ResponseDto.success(
      new TankResource(tank),
      'Tank created successfully',
    );
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('includeArchived') includeArchived: boolean = false,
  ) {
    const tanks = await this.aquariumManager.findAllTanks(
      page,
      perPage,
      includeArchived,
    );
    const resourceData = TankResource.collection(tanks.items);
    const paginatedResource = PaginatedResult.create(resourceData, tanks.meta);
    return ResponseDto.success(paginatedResource);
  }

  @Get('my-tanks')
  async findMyTanks(@CurrentUser() user: User) {
    const tanks = await this.aquariumManager.findTanksByUserId(user.id);
    return ResponseDto.success(TankResource.collection(tanks));
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const tank = await this.aquariumManager.findTankById(id);
    return ResponseDto.success(new TankResource(tank));
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTankDto: UpdateTankRequest,
  ) {
    const tank = await this.aquariumManager.updateTank(id, updateTankDto);
    return ResponseDto.success(
      new TankResource(tank),
      'Tank updated successfully',
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.aquariumManager.deleteTank(id);
    return ResponseDto.success(null, 'Tank deleted successfully');
  }

  // New routes for archive/unarchive, assign/remove from user
  @Patch(':id/archive')
  async archive(@Param('id') id: number) {
    const tank = await this.aquariumManager.archiveTank(id);
    return ResponseDto.success(
      new TankResource(tank),
      'Tank archived successfully',
    );
  }

  @Patch(':id/unarchive')
  async unarchive(@Param('id') id: number) {
    const tank = await this.aquariumManager.unarchiveTank(id);
    return ResponseDto.success(
      new TankResource(tank),
      'Tank unarchived successfully',
    );
  }

  @Patch(':id/assign/:userId')
  async assignToUser(
    @Param('id') tankId: number,
    @Param('userId') userId: number,
  ) {
    const tank = await this.aquariumManager.assignTankToUser(tankId, userId);
    return ResponseDto.success(
      new TankResource(tank),
      'Tank assigned to user successfully',
    );
  }

  @Patch(':id/remove-from-user')
  async removeFromUser(@Param('id') tankId: number) {
    const tank = await this.aquariumManager.removeTankFromUser(tankId);
    return ResponseDto.success(
      new TankResource(tank),
      'Tank removed from user successfully',
    );
  }
}
