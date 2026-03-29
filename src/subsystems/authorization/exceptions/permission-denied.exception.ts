import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class PermissionDeniedException extends DomainException {
  readonly code = 'PERMISSION_DENIED';
  readonly httpStatus = HttpStatus.FORBIDDEN;

  constructor(public readonly permission: string) {
    super(`You do not have permission to perform this action: '${permission}'`);
  }

  getDetails() {
    return { permission: this.permission };
  }
}
