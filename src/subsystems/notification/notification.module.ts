import { Module } from '@nestjs/common';
import { UtilitiesModule } from '@utilities/utility.module';
import { NotificationManager } from './managers/notification.manager';
import { EmailAccess } from './accessors/email.access';

@Module({
  imports: [UtilitiesModule],
  providers: [
    { provide: 'INotificationManager', useClass: NotificationManager },
    // Internal — not exported (subsystem boundary enforcement)
    { provide: 'IEmailAccess', useClass: EmailAccess },
  ],
  exports: ['INotificationManager'],
})
export class NotificationModule {}
