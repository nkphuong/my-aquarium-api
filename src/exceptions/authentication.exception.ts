import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class AuthenticationException extends DomainException {
  readonly code = 'UNAUTHORIZED';
  readonly httpStatus = HttpStatus.UNAUTHORIZED;

  constructor(message: string = 'Authentication failed') {
    super(message);
  }
}
