export interface IEventUtility {
  emit<T>(eventName: string, payload: T): void;
}
