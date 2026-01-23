import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@core/exceptions/domain.exception';

export class FishSpeciesNotFoundException extends DomainException {
    readonly code = 'FISH_SPECIES_NOT_FOUND';
    readonly httpStatus = HttpStatus.NOT_FOUND;

    constructor(public readonly speciesId: number | string) {
        super(`Fish species with id ${speciesId} not found`);
    }

    getDetails() {
        return { speciesId: this.speciesId };
    }
}
