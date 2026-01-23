import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
    readonly code = 'USER_NOT_FOUND';
    readonly httpStatus = HttpStatus.NOT_FOUND;

    constructor(public readonly userId: number | string) {
        super(`User with id ${userId} not found`);
    }

    getDetails() {
        return { userId: this.userId };
    }
}
