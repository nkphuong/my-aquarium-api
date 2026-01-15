import { Module } from '@nestjs/common';
import { LivestockController } from '@presentation/controllers/livestock.controller';
import { LivestockService } from '@application/services/livestock.service';
import { LivestockRepository } from '@infrastructure/repositories/livestock.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Module({
    controllers: [LivestockController],
    providers: [LivestockService, LivestockRepository, PrismaService],
    exports: [LivestockService],
})
export class LivestockModule { }
