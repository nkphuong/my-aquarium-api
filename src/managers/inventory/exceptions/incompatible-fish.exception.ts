import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class IncompatibleFishException extends DomainException {
  readonly code = 'FISH_INCOMPATIBLE';
  readonly httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;

  constructor(
    public readonly fishName: string,
    public readonly tankName: string,
    public readonly reason: string,
    public readonly conflictWith?: string,
  ) {
    super(`${fishName} cannot be added to ${tankName}: ${reason}`);
  }

  getDetails() {
    return {
      fishName: this.fishName,
      tankName: this.tankName,
      reason: this.reason,
      ...(this.conflictWith && { conflictWith: this.conflictWith }),
    };
  }
}
