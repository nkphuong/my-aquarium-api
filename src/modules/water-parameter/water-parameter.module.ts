import { Module } from '@nestjs/common';
import { WaterParameterController } from '@presentation/controllers/water-parameter.controller';
import { WaterParameterService } from '@application/services/water-parameter.service';
import { WaterParameterRepository } from '@infrastructure/repositories/water-parameter.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Module({
    controllers: [WaterParameterController],
    providers: [WaterParameterService, WaterParameterRepository, PrismaService],
    exports: [WaterParameterService],
})
export class WaterParameterModule { }
