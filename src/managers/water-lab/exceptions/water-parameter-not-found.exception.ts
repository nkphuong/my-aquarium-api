import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class WaterParameterNotFoundException extends DomainException {
  readonly code = 'WATER_PARAMETER_NOT_FOUND';
  readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor(public readonly waterParameterId: number | string) {
    super(`Water parameter with id ${waterParameterId} not found`);
  }

  getDetails() {
    return { waterParameterId: this.waterParameterId };
  }
}
