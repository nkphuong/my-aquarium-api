import { Module } from '@nestjs/common';
import { UtilitiesModule } from '@utilities/utility.module';

// Accessors
import { TankAccessor } from './accessors/tank.accessor';
import { FishAccessor } from './accessors/fish.accessor';
import { FishSpeciesAccessor } from './accessors/fish-species.accessor';
import { LivestockAccessor } from './accessors/livestock.accessor';
import { WaterParameterAccessor } from './accessors/water-parameter.accessor';
import { SetupTankAccessor } from './accessors/setup-tank.accessor';
import { CompatibilityOverrideAccessor } from './accessors/compatibility-override.accessor';

// Accessor tokens
import { TANK_ACCESSOR } from './contracts/tank.accessor.interface';
import { FISH_ACCESSOR } from './contracts/fish.accessor.interface';
import { FISH_SPECIES_ACCESSOR } from './contracts/fish-species.accessor.interface';
import { LIVESTOCK_ACCESSOR } from './contracts/livestock.accessor.interface';
import { WATER_PARAMETER_ACCESSOR } from './contracts/water-parameter.accessor.interface';
import { SETUP_TANK_ACCESSOR } from './contracts/setup-tank.accessor.interface';
import { COMPATIBILITY_OVERRIDE_ACCESSOR } from './contracts/compatibility-override.accessor.interface';

// Engines
import { BioloadEngine } from './engines/bioload.engine';
import { CompatibilityEngine } from './engines/compatibility.engine';
import { WaterQualityEngine } from './engines/water-quality.engine';
import { SuggestionTankIdeaEngine } from './engines/suggestion-tank-idea.engine';
import { FishSpeciesEngine } from './engines/fish-species.engine';

// Managers
import { AquariumManager } from './managers/aquarium.manager';
import { InventoryManager } from './managers/inventory.manager';
import { WaterLabManager } from './managers/water-lab.manager';
import { CompatibilityManager } from './managers/compatibility.manager';

@Module({
  imports: [UtilitiesModule],
  providers: [
    // Accessors — internal data access
    { provide: TANK_ACCESSOR, useClass: TankAccessor },
    { provide: FISH_ACCESSOR, useClass: FishAccessor },
    { provide: FISH_SPECIES_ACCESSOR, useClass: FishSpeciesAccessor },
    { provide: LIVESTOCK_ACCESSOR, useClass: LivestockAccessor },
    { provide: WATER_PARAMETER_ACCESSOR, useClass: WaterParameterAccessor },
    { provide: SETUP_TANK_ACCESSOR, useClass: SetupTankAccessor },
    { provide: COMPATIBILITY_OVERRIDE_ACCESSOR, useClass: CompatibilityOverrideAccessor },

    // Engines — pure business logic
    BioloadEngine,
    CompatibilityEngine,
    WaterQualityEngine,
    SuggestionTankIdeaEngine,
    FishSpeciesEngine,

    // Managers — orchestration
    AquariumManager,
    InventoryManager,
    WaterLabManager,
    CompatibilityManager,
  ],
  exports: [
    // Accessor tokens for cross-subsystem use (e.g., chat subsystem)
    TANK_ACCESSOR,
    FISH_ACCESSOR,
    FISH_SPECIES_ACCESSOR,
    LIVESTOCK_ACCESSOR,
    WATER_PARAMETER_ACCESSOR,
    // Managers for controller use
    AquariumManager,
    InventoryManager,
    WaterLabManager,
    CompatibilityManager,
  ],
})
export class AquariumModule {}
