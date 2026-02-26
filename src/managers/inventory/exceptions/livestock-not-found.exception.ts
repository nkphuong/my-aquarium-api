import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class LivestockNotFoundException extends DomainException {
  readonly code = 'LIVESTOCK_NOT_FOUND';
  readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor(public readonly livestockId: number | string) {
    super(`Livestock with id ${livestockId} not found`);
  }

  getDetails() {
    return { livestockId: this.livestockId };
  }
}
