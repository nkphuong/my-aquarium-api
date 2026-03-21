import { Injectable, Inject } from '@nestjs/common';
import type { ILoggingUtility } from '@utilities/logging/logging.utility.interface';

@Injectable()
export abstract class BaseAccessor {
  constructor(
    @Inject('ILoggingUtility')
    protected readonly logger: ILoggingUtility,
  ) {}
}
