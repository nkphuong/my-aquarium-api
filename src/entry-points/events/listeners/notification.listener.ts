import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { INotificationManager } from '@subsystems/notification/contracts/notification.manager.interface';
import { UserRegisteredEvent } from '@subsystems/notification/events/user-registered.event';

@Injectable()
export class NotificationListener {
  constructor(
    @Inject('INotificationManager')
    private readonly notificationManager: INotificationManager,
  ) {}

  @OnEvent('user.registered')
  async onUserRegistered(event: UserRegisteredEvent): Promise<void> {
    await this.notificationManager.handleUserRegistered(event);
  }
}
