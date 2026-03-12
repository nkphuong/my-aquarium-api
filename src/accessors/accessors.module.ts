import { Module, Global } from '@nestjs/common';
import { SetupTankAccessor } from './ai/setup-tank.accessor';
import { TankAccessor } from './aquarium/tank.accessor';
import { WaterParameterAccessor } from './aquarium/water-parameter.accessor';
import { FishAccessor } from './livestock/fish.accessor';
import { FishSpeciesAccessor } from './livestock/fish-species.accessor';
import { LivestockAccessor } from './livestock/livestock.accessor';
import { UserAccessor } from './user/user.accessor';

import { SETUP_TANK_ACCESSOR } from './ai/interfaces/setup-tank.accessor.interface';
import { TANK_ACCESSOR } from './aquarium/interfaces/tank.accessor.interface';
import { WATER_PARAMETER_ACCESSOR } from './aquarium/interfaces/water-parameter.accessor.interface';
import { FISH_ACCESSOR } from './livestock/interfaces/fish.accessor.interface';
import { FISH_SPECIES_ACCESSOR } from './livestock/interfaces/fish-species.accessor.interface';
import { LIVESTOCK_ACCESSOR } from './livestock/interfaces/livestock.accessor.interface';
import { USER_ACCESSOR } from './user/interfaces/user.accessor.interface';

export const ACCESSOR_PROVIDERS = [
    {
        provide: SETUP_TANK_ACCESSOR,
        useClass: SetupTankAccessor,
    },
    {
        provide: TANK_ACCESSOR,
        useClass: TankAccessor,
    },
    {
        provide: WATER_PARAMETER_ACCESSOR,
        useClass: WaterParameterAccessor,
    },
    {
        provide: FISH_ACCESSOR,
        useClass: FishAccessor,
    },
    {
        provide: FISH_SPECIES_ACCESSOR,
        useClass: FishSpeciesAccessor,
    },
    {
        provide: LIVESTOCK_ACCESSOR,
        useClass: LivestockAccessor,
    },
    {
        provide: USER_ACCESSOR,
        useClass: UserAccessor,
    },
];

@Global()
@Module({
    providers: ACCESSOR_PROVIDERS,
    exports: ACCESSOR_PROVIDERS,
})
export class AccessorsModule { }
