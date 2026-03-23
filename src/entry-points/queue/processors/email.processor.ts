import { Inject } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import type { ILoggingUtility } from '@utilities/logging/logging.utility.interface';
import type { INotificationManager } from '@subsystems/notification/contracts/notification.manager.interface';
import { QUEUE_NAMES } from '@subsystems/notification/constants/queue.constants';

@Processor(QUEUE_NAMES.NOTIFICATION_EMAIL)
export class EmailProcessor extends WorkerHost {
  constructor(
    @Inject('ILoggingUtility') private logger: ILoggingUtility,
    @Inject('INotificationManager')
    private notificationManager: INotificationManager,
  ) {
    super();
  }

  async process(
    job: Job<{ userId: number; email: string; fullname?: string }>,
  ): Promise<void> {
    switch (job.name) {
      case 'send-verification-email':
        await this.sendVerificationEmail(job.data.email, job.data.fullname);
        break;
      default:
        this.logger.logWarning(
          `Unknown job name: ${job.name}`,
          'EmailProcessor',
        );
    }
  }

  private async sendVerificationEmail(
    email: string,
    fullname?: string,
  ): Promise<void> {
    await this.notificationManager.sendEmail({
      to: email,
      subject: 'Verify your email - AI Aggregator',
      template: 'verification',
      data: { displayName: fullname || 'there' },
    });
  }
}
