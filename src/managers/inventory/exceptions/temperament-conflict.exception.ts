import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class TemperamentConflictException extends DomainException {
  readonly code = 'TEMPERAMENT_CONFLICT';
  readonly httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;

  constructor(
    public readonly aggressiveFish: string,
    public readonly peacefulFish: string,
  ) {
    super(
      `${aggressiveFish} (aggressive) will harm ${peacefulFish} (peaceful)`,
    );
  }

  getDetails() {
    return {
      aggressiveFish: this.aggressiveFish,
      peacefulFish: this.peacefulFish,
    };
  }
}
