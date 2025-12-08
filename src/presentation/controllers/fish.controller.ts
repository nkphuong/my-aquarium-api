import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateFishUseCase } from '@application/use-cases/fish/create-fish.use-case';
import { GetAllFishUseCase } from '@application/use-cases/fish/get-all-fish.use-case';
import { CreateFishDto } from '@application/dtos/fish.dto';
import { ResponseDto } from '@presentation/dto/response.dto';

@Controller('fish')
export class FishController {
  constructor(
    private readonly createFishUseCase: CreateFishUseCase,
    private readonly getAllFishUseCase: GetAllFishUseCase,
  ) {}

  @Post()
  async create(@Body() createFishDto: CreateFishDto) {
    try {
      const fish = await this.createFishUseCase.execute(createFishDto);
      return ResponseDto.success(fish, 'Fish created successfully');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const fishes = await this.getAllFishUseCase.execute();
      return ResponseDto.success(fishes);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }
}
