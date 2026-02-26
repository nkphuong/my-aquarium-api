import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class FishNotFoundException extends DomainException {
  readonly code = 'FISH_NOT_FOUND';
  readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor(public readonly fishId: number | string) {
    super(`Fish with id ${fishId} not found`);
  }

  getDetails() {
    return { fishId: this.fishId };
  }
}
