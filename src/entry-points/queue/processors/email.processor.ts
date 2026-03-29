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
    job: Job<{
      email: string;
      fullname?: string;
      verificationUrl?: string;
      resetUrl?: string;
      expiresInHours: string;
    }>,
  ): Promise<void> {
    switch (job.name) {
      case 'send-verification-email':
        await this.sendVerificationEmail(
          job.data.email,
          job.data.fullname,
          job.data.verificationUrl || '',
          job.data.expiresInHours,
        );
        break;
      case 'send-password-reset-email':
        await this.sendPasswordResetEmail(
          job.data.email,
          job.data.fullname,
          job.data.resetUrl || '',
          job.data.expiresInHours,
        );
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
    fullname: string | undefined,
    verificationUrl: string,
    expiresInHours: string,
  ): Promise<void> {
    await this.notificationManager.sendEmail({
      to: email,
      subject: 'Verify your email - My Aquarium',
      template: 'verification',
      data: {
        displayName: fullname || 'there',
        verificationUrl,
        expiresInHours,
      },
    });
  }

  private async sendPasswordResetEmail(
    email: string,
    fullname: string | undefined,
    resetUrl: string,
    expiresInHours: string,
  ): Promise<void> {
    await this.notificationManager.sendEmail({
      to: email,
      subject: 'Reset your password - My Aquarium',
      template: 'password-reset',
      data: {
        displayName: fullname || 'there',
        resetUrl,
        expiresInHours,
      },
    });
  }
}
