import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type {
  IQueueUtility,
  JobOptions,
} from '@utilities/queue/queue.utility.interface';

@Injectable()
export class QueueUtility implements IQueueUtility {
  constructor(private readonly moduleRef: ModuleRef) {}

  async addJob<T>(
    queueName: string,
    jobName: string,
    data: T,
    options?: JobOptions,
  ): Promise<void> {
    const queue = this.moduleRef.get<Queue>(getQueueToken(queueName), {
      strict: false,
    });
    await queue.add(jobName, data, {
      priority: options?.priority,
      delay: options?.delay,
    });
  }
}
