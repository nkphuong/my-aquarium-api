import { UserRegisteredEvent } from '../events/user-registered.event';
import type { SendEmailParams } from './email.access.interface';

export interface INotificationManager {
  handleUserRegistered(event: UserRegisteredEvent): Promise<void>;
  sendEmail(params: SendEmailParams): Promise<void>;
}
