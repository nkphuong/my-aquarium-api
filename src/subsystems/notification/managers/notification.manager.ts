import { Injectable, Inject } from '@nestjs/common';
import type { INotificationManager } from '../contracts/notification.manager.interface';
import type { IQueueUtility } from '@utilities/queue/queue.utility.interface';
import type { IEmailAccess } from '../contracts/email.access.interface';
import type { SendEmailParams } from '../contracts/email.access.interface';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { QUEUE_NAMES } from '../constants/queue.constants';

@Injectable()
export class NotificationManager implements INotificationManager {
  constructor(
    @Inject('IQueueUtility') private queueUtility: IQueueUtility,
    @Inject('IEmailAccess') private emailAccess: IEmailAccess,
  ) {}

  async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
    await this.queueUtility.addJob(
      QUEUE_NAMES.NOTIFICATION_EMAIL,
      'send-verification-email',
      {
        userId: event.userId,
        email: event.email,
        fullname: event.fullname,
      },
    );
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    await this.emailAccess.sendEmail(params);
  }
}
