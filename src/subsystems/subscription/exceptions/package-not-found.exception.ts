import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class PackageNotFoundException extends DomainException {
  readonly code = 'PACKAGE_NOT_FOUND';
  readonly httpStatus = HttpStatus.NOT_FOUND;

  constructor(public readonly identifier: number | string) {
    super(`Package '${identifier}' not found`);
  }

  getDetails() {
    return { identifier: this.identifier };
  }
}
