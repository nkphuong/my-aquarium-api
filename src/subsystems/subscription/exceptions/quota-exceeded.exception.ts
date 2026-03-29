import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class QuotaExceededException extends DomainException {
  readonly code = 'QUOTA_EXCEEDED';
  readonly httpStatus = HttpStatus.FORBIDDEN;

  constructor(
    public readonly resource: string,
    public readonly limit: number,
  ) {
    super(`Quota exceeded for '${resource}'. Your plan allows up to ${limit}.`);
  }

  getDetails() {
    return { resource: this.resource, limit: this.limit };
  }
}
