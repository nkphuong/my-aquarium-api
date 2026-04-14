import { CompatibilityOverride } from '../entities/compatibility-override.entity';

export interface ICompatibilityOverrideAccessor {
  findBySpeciesSet(speciesIds: number[]): Promise<CompatibilityOverride[]>;
  findByPair(
    speciesAId: number,
    speciesBId: number,
  ): Promise<CompatibilityOverride | null>;
}

export const COMPATIBILITY_OVERRIDE_ACCESSOR = Symbol(
  'ICompatibilityOverrideAccessor',
);
