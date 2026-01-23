import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@core/database/database.module';
import { FishModule } from '@modules/fish/fish.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TankModule } from '@modules/tank/tank.module';
import { FishSpeciesModule } from '@modules/fish-species/fish-species.module';
import { LivestockModule } from '@modules/livestock/livestock.module';
import { WaterParameterModule } from '@modules/water-parameter/water-parameter.module';
import { DomainExceptionFilter, AllExceptionsFilter } from '@core/filters/domain-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    FishModule,
    AuthModule,
    TankModule,
    FishSpeciesModule,
    LivestockModule,
    WaterParameterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global exception filters (order matters: most specific first)
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule { }

