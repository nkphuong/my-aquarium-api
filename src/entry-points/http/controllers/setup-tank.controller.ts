import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SetupTankRequest } from '../requests/setup-tank.request';
import { ResponseDto } from '@core/dto/response.dto';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@entities/user.entity';
import { SetupTankResource } from '../resources/setup-tank.resource';
import { AquariumManager } from '@managers/aquarium.manager';

@Controller('setup-tanks')
@UseGuards(JwtAuthGuard)
export class SetupTankController {
  constructor(private readonly aquariumManager: AquariumManager) { }

  @Post()
  async create(
    @Body() setupTankRequest: SetupTankRequest,
    @CurrentUser() user: User,
  ) {
    const suggestion = await this.aquariumManager.setupTank(setupTankRequest.ideas);

    return ResponseDto.success(
      new SetupTankResource({
        ideas: suggestion,
        user_id: user.id,
      }),
    );
  }
}
