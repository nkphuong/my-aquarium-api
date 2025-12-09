import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FishService } from '@application/services/fish.service';
import { CreateFishDto } from '@application/dtos/fish.dto';
import { ResponseDto } from '@presentation/dto/response.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';
import { UserDto } from '@application/dtos/auth.dto';

@Controller('fish')
@UseGuards(JwtAuthGuard) // Protect all routes in this controller
export class FishController {
  constructor(private readonly fishService: FishService) {}

  @Post()
  async create(
    @Body() createFishDto: CreateFishDto,
    @CurrentUser() user: UserDto, // Access current authenticated user
  ) {
    try {
      const fish = await this.fishService.create(createFishDto);
      return ResponseDto.success(fish, 'Fish created successfully');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Get()
  async findAll(@CurrentUser() user: UserDto) {
    try {
      const fishes = await this.fishService.findAll();
      return ResponseDto.success(fishes);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }
}
