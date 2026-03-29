export interface JobOptions {
  priority?: number;
  delay?: number;
}

export interface IQueueUtility {
  addJob<T>(
    queueName: string,
    jobName: string,
    data: T,
    options?: JobOptions,
  ): Promise<void>;
}
