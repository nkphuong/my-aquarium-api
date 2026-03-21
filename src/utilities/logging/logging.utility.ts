import { Injectable, Logger } from '@nestjs/common';
import { ILoggingUtility } from '@utilities/logging/logging.utility.interface';

@Injectable()
export class LoggingUtility implements ILoggingUtility {
  private readonly logger = new Logger('AppSystem');

  public logInfo(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  public logWarning(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  public logError(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  public logDebug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }
}
