import { Module } from '@nestjs/common';
import { UtilitiesModule } from '@utilities/utility.module';
import { NotificationModule } from '@subsystems/notification/notification.module';
import { EmailProcessor } from './processors/email.processor';

@Module({
  imports: [UtilitiesModule, NotificationModule],
  providers: [EmailProcessor],
})
export class QueueEntryPointModule {}
