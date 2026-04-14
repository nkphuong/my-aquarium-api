import { Injectable, Inject } from '@nestjs/common';
import { IChatContextAccessor } from '../contracts/chat-context.accessor.interface';
import { UserAquariumContext } from '../types/context.types';

import type { ITankAccessor } from '@subsystems/aquarium/contracts/tank.accessor.interface';
import { TANK_ACCESSOR } from '@subsystems/aquarium/contracts/tank.accessor.interface';
import type { IFishAccessor } from '@subsystems/aquarium/contracts/fish.accessor.interface';
import { FISH_ACCESSOR } from '@subsystems/aquarium/contracts/fish.accessor.interface';
import type { IFishSpeciesAccessor } from '@subsystems/aquarium/contracts/fish-species.accessor.interface';
import { FISH_SPECIES_ACCESSOR } from '@subsystems/aquarium/contracts/fish-species.accessor.interface';
import type { ILivestockAccessor } from '@subsystems/aquarium/contracts/livestock.accessor.interface';
import { LIVESTOCK_ACCESSOR } from '@subsystems/aquarium/contracts/livestock.accessor.interface';
import type { IWaterParameterAccessor } from '@subsystems/aquarium/contracts/water-parameter.accessor.interface';
import { WATER_PARAMETER_ACCESSOR } from '@subsystems/aquarium/contracts/water-parameter.accessor.interface';

@Injectable()
export class ChatContextAccessor implements IChatContextAccessor {
  constructor(
    @Inject(TANK_ACCESSOR) private readonly tankAccessor: ITankAccessor,
    @Inject(FISH_ACCESSOR) private readonly fishAccessor: IFishAccessor,
    @Inject(FISH_SPECIES_ACCESSOR)
    private readonly fishSpeciesAccessor: IFishSpeciesAccessor,
    @Inject(LIVESTOCK_ACCESSOR)
    private readonly livestockAccessor: ILivestockAccessor,
    @Inject(WATER_PARAMETER_ACCESSOR)
    private readonly waterParameterAccessor: IWaterParameterAccessor,
  ) {}

  async gatherUserContext(userId: number): Promise<UserAquariumContext> {
    // Fetch all user tanks and species reference in parallel
    const [tanks, fishSpecies] = await Promise.all([
      this.tankAccessor.findByUserId(userId),
      this.fishSpeciesAccessor.findAll(),
    ]);

    // Fan-out: fetch fish, livestock, and latest water params per tank
    const fishByTank = new Map<number, import('@subsystems/aquarium/entities/fish.entity').Fish[]>();
    const livestockByTank = new Map<number, import('@subsystems/aquarium/entities/livestock.entity').Livestock[]>();
    const latestWaterParams = new Map<number, import('@subsystems/aquarium/entities/water-parameter.entity').WaterParameter | null>();

    await Promise.all(
      tanks.map(async (tank) => {
        const [fish, livestock, waterParam] = await Promise.all([
          this.fishAccessor.findByTankId(tank.id),
          this.livestockAccessor.findByTankId(tank.id),
          this.waterParameterAccessor.findLatestByTankId(tank.id),
        ]);

        fishByTank.set(tank.id, fish);
        livestockByTank.set(tank.id, livestock);
        latestWaterParams.set(tank.id, waterParam);
      }),
    );

    return {
      tanks,
      fishByTank,
      livestockByTank,
      latestWaterParams,
      fishSpecies,
    };
  }
}
