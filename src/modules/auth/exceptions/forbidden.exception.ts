import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class ForbiddenException extends DomainException {
    readonly code = 'FORBIDDEN';
    readonly httpStatus = HttpStatus.FORBIDDEN;

    constructor(message: string = 'Access denied') {
        super(message);
    }
}
