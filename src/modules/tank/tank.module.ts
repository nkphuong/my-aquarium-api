import { Module } from '@nestjs/common';
import { TankController } from '@presentation/controllers/tank.controller';
import { TankService } from '@application/services/tank.service';
import { TankRepository } from '@infrastructure/repositories/tank.repository';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule], // Import to access JwtAuthGuard
  controllers: [TankController],
  providers: [TankService, TankRepository],
})
export class TankModule {}
