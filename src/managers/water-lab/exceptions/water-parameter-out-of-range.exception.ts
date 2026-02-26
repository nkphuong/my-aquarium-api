import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class WaterParameterOutOfRangeException extends DomainException {
  readonly code = 'WATER_PARAM_OUT_OF_RANGE';
  readonly httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;

  constructor(
    public readonly parameter:
      | 'pH'
      | 'temperature'
      | 'ammonia'
      | 'nitrite'
      | 'nitrate',
    public readonly currentValue: number,
    public readonly minValue: number,
    public readonly maxValue: number,
    public readonly fishName: string,
  ) {
    super(
      `${parameter} = ${currentValue} is outside safe range for ${fishName} (${minValue}-${maxValue})`,
    );
  }

  getDetails() {
    return {
      parameter: this.parameter,
      currentValue: this.currentValue,
      minValue: this.minValue,
      maxValue: this.maxValue,
      fishName: this.fishName,
    };
  }
}
