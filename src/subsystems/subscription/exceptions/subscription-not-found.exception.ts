import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class SubscriptionNotFoundException extends DomainException {
  readonly code = 'SUBSCRIPTION_NOT_FOUND';
  readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor(public readonly userId: number) {
    super(`No active subscription found for user ${userId}`);
  }

  getDetails() {
    return { userId: this.userId };
  }
}
