import { Module } from '@nestjs/common';
import { AccessorsModule } from '@accessors/accessors.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter, DomainExceptionFilter } from './core/filters/domain-exception.filter';
import { ConfigModule } from '@nestjs/config';

import { EnginesModule } from './engines/engines.module';

// Data Subsystems

// Application Workflows
import { ManagerModule } from './managers/manager.module';
import { AiModule } from './shared/ai/ai.module';

import { DatabaseModule } from './core/database/database.module';
import { EntitiesModule } from './database/entities/entities.module';

@Module({
  imports: [
    AiModule,
    AccessorsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local',
        '.env.development',
        '.env'
      ],
    }),
    DatabaseModule,
    EntitiesModule,
    EnginesModule,

    // Workflow Applications
    ManagerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Catch-all filter for generic errors
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      // Specific filter for our custom domain exceptions
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule { }
