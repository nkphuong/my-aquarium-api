import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class RoleNotFoundException extends DomainException {
  readonly code = 'ROLE_NOT_FOUND';
  readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor(public readonly identifier: number | string) {
    super(`Role '${identifier}' not found`);
  }

  getDetails() {
    return { identifier: this.identifier };
  }
}
