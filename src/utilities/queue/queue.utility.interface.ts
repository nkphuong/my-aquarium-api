export interface IQueueUtility {
  addJob<T>(queueName: string, jobName: string, data: T): Promise<void>;
}
