import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class TankNotFoundException extends DomainException {
    readonly code = 'TANK_NOT_FOUND';
    readonly httpStatus = HttpStatus.NOT_FOUND;

    constructor(public readonly tankId: number | string) {
        super(`Tank with id ${tankId} not found`);
    }

    getDetails() {
        return { tankId: this.tankId };
    }
}
