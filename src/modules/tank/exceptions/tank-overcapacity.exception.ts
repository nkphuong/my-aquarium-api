import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class TankOvercapacityException extends DomainException {
    readonly code = 'TANK_OVERCAPACITY';
    readonly httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;

    constructor(
        public readonly tankName: string,
        public readonly currentBioload: number,
        public readonly maxBioload: number,
        public readonly fishBioload: number,
    ) {
        super(
            `${tankName} is at ${currentBioload}/${maxBioload} bioload. Fish requires ${fishBioload}.`,
        );
    }

    getDetails() {
        return {
            tankName: this.tankName,
            currentBioload: this.currentBioload,
            maxBioload: this.maxBioload,
            fishBioload: this.fishBioload,
        };
    }
}
