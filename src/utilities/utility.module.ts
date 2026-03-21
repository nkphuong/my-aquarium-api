import { Module } from '@nestjs/common';
import { SecurityUtility } from './security/security.utility';
import { LoggingUtility } from './logging/logging.utility';
import { EventUtility } from './event/event.utility';
import { QueueUtility } from './queue/queue.utility';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessToken.secret'),
      }),
    }),
  ],
  providers: [
    {
      provide: 'ISecurityUtility',
      useClass: SecurityUtility,
    },
    {
      provide: 'ILoggingUtility',
      useClass: LoggingUtility,
    },
    {
      provide: 'IEventUtility',
      useClass: EventUtility,
    },
    {
      provide: 'IQueueUtility',
      useClass: QueueUtility,
    },
  ],
  exports: [
    'ISecurityUtility',
    'ILoggingUtility',
    'IEventUtility',
    'IQueueUtility',
  ],
})
export class UtilitiesModule {}
