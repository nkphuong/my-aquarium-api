import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { QueueEntryPointModule } from '@entry-points/queue/queue.module';
import { QUEUE_NAMES } from '@subsystems/notification/constants/queue.constants';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import serviceConfig from './config/service.config';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.development', '.env'],
      load: [appConfig, databaseConfig, serviceConfig, mailConfig],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...mikroOrmConfig,
        clientUrl: configService.get<string>('database.url'),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('service.redis.host'),
          port: configService.get('service.redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: QUEUE_NAMES.NOTIFICATION_EMAIL }),
    QueueEntryPointModule,
  ],
})
export class AppQueueModule {}
