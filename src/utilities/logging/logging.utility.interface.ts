export interface ILoggingUtility {
  logInfo(message: string, context?: string): void;
  logWarning(message: string, context?: string): void;
  logError(message: string, trace?: string, context?: string): void;
  logDebug(message: string, context?: string): void;
}
