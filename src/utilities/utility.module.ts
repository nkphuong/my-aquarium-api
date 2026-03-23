import { Module } from '@nestjs/common';
import { SecurityUtility } from './security/security.utility';
import { AuthConfigUtility } from './auth-config/auth-config.utility';
import { LoggingUtility } from './logging/logging.utility';
import { EventUtility } from './event/event.utility';
import { QueueUtility } from './queue/queue.utility';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    {
      provide: 'ISecurityUtility',
      useClass: SecurityUtility,
    },
    {
      provide: 'IAuthConfigUtility',
      useClass: AuthConfigUtility,
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
    'IAuthConfigUtility',
    'ILoggingUtility',
    'IEventUtility',
    'IQueueUtility',
  ],
})
export class UtilitiesModule {}
