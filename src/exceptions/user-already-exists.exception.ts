import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class UserAlreadyExistsException extends DomainException {
  readonly code = 'USER_ALREADY_EXISTS';
  readonly httpStatus = HttpStatus.CONFLICT;

  constructor(public readonly email: string) {
    super(`User with email ${email} already exists`);
  }

  getDetails() {
    return { email: this.email };
  }
}
