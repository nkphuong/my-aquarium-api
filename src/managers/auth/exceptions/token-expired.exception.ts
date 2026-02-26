import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class TokenExpiredException extends DomainException {
  readonly code = 'TOKEN_EXPIRED';
  readonly httpStatus = HttpStatus.UNAUTHORIZED;

  constructor(message: string = 'Token has expired') {
    super(message);
  }
}
