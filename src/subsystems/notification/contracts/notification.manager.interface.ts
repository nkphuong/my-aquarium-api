import { UserRegisteredEvent } from '../events/user-registered.event';
import { PasswordResetRequestedEvent } from '../events/password-reset-requested.event';
import type { SendEmailParams } from './email.access.interface';

export interface INotificationManager {
  handleUserRegistered(event: UserRegisteredEvent): Promise<void>;
  handlePasswordResetRequested(
    event: PasswordResetRequestedEvent,
  ): Promise<void>;
  sendEmail(params: SendEmailParams): Promise<void>;
}
