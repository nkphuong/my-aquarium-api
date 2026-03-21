import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class TerritoryConflictException extends DomainException {
  readonly code = 'TERRITORY_CONFLICT';
  readonly httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;

  constructor(
    public readonly fish1: string,
    public readonly fish2: string,
    public readonly zone: 'bottom' | 'mid' | 'top',
  ) {
    super(
      `${fish1} and ${fish2} both occupy ${zone} zone - territory conflict`,
    );
  }

  getDetails() {
    return {
      fish1: this.fish1,
      fish2: this.fish2,
      zone: this.zone,
    };
  }
}
