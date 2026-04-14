import { Controller, Post, Get, Body, HttpException } from '@nestjs/common';
import { CompatibilityManager } from '@subsystems/aquarium/managers/compatibility.manager';
import { CompatibilityCheckRequestDTO } from '@subsystems/aquarium/dtos/compatibility-check.dto';
import { DomainException } from '@core/exceptions/domain.exception';

@Controller('v1/compatibility')
export class CompatibilityController {
  constructor(
    private readonly compatibilityManager: CompatibilityManager,
  ) {}

  @Post('check')
  async checkCompatibility(@Body() dto: CompatibilityCheckRequestDTO) {
    try {
      return await this.compatibilityManager.checkCompatibility(dto);
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, error.httpStatus);
      }
      throw error;
    }
  }

  @Get('species')
  async getSpeciesList() {
    return await this.compatibilityManager.getSpeciesList();
  }
}
