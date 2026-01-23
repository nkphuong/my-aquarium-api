import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class UnauthorizedException extends DomainException {
    readonly code = 'INVALID_CREDENTIALS';
    readonly httpStatus = HttpStatus.UNAUTHORIZED;

    constructor(message: string = 'Invalid credentials') {
        super(message);
    }
}
