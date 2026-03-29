import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class FeatureNotAvailableException extends DomainException {
  readonly code = 'FEATURE_NOT_AVAILABLE';
  readonly httpStatus = HttpStatus.FORBIDDEN;

  constructor(public readonly feature: string) {
    super(`Feature '${feature}' is not available on your current plan`);
  }

  getDetails() {
    return { feature: this.feature };
  }
}
