import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IEventUtility } from '@utilities/event/event.utility.interface';

@Injectable()
export class EventUtility implements IEventUtility {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit(eventName: string, payload: any): void {
    this.eventEmitter.emit(eventName, payload);
  }
}
