import { Module } from '@nestjs/common';
import { FishController } from '@presentation/controllers/fish.controller';
import { FishService } from '@application/services/fish.service';
import { FishRepository } from '@infrastructure/repositories/fish.repository';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule], // Import to access JwtAuthGuard
  controllers: [FishController],
  providers: [
    FishService,
    FishRepository,
  ],
})
export class FishModule {}
