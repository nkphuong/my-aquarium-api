import { Module } from '@nestjs/common';
import { NotificationModule } from '@subsystems/notification/notification.module';
import { NotificationListener } from './listeners/notification.listener';

@Module({
  imports: [NotificationModule],
  providers: [NotificationListener],
})
export class EventEntryPointModule {}
