import { Injectable, Inject } from '@nestjs/common';
import type { INotificationManager } from '../contracts/notification.manager.interface';
import type { IQueueUtility } from '@utilities/queue/queue.utility.interface';
import type { IEmailAccess } from '../contracts/email.access.interface';
import type { SendEmailParams } from '../contracts/email.access.interface';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { PasswordResetRequestedEvent } from '../events/password-reset-requested.event';
import { QUEUE_NAMES } from '../constants/queue.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationManager implements INotificationManager {
  constructor(
    @Inject('IQueueUtility') private queueUtility: IQueueUtility,
    @Inject('IEmailAccess') private emailAccess: IEmailAccess,
    private readonly configService: ConfigService,
  ) {}

  async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
    const appUrl = this.configService.get<string>('app.appUrl');
    const expiresInHours =
      this.configService.get<number>(
        'auth.accountVerification.expireInHours',
      ) ?? 24;
    const verificationUrl = event.verificationToken
      ? `${appUrl}/verify-email?token=${event.verificationToken}`
      : undefined;

    await this.queueUtility.addJob(
      QUEUE_NAMES.NOTIFICATION_EMAIL,
      'send-verification-email',
      {
        userId: event.userId,
        email: event.email,
        fullname: event.fullname,
        verificationUrl,
        expiresInHours: String(expiresInHours),
      },
    );
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    await this.emailAccess.sendEmail(params);
  }

  async handlePasswordResetRequested(
    event: PasswordResetRequestedEvent,
  ): Promise<void> {
    const appUrl = this.configService.get<string>('app.appUrl');
    const expiresInHours =
      this.configService.get<number>('auth.passwordReset.expireInHours') ?? 1;
    const resetUrl = `${appUrl}/reset-password?token=${event.resetToken}`;

    await this.queueUtility.addJob(
      QUEUE_NAMES.NOTIFICATION_EMAIL,
      'send-password-reset-email',
      {
        email: event.email,
        fullname: event.fullname,
        resetUrl,
        expiresInHours: String(expiresInHours),
      },
    );
  }
}
