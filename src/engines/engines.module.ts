import { Module, Global } from '@nestjs/common';
import { BioloadEngine } from './bioload.engine';
import { CompatibilityEngine } from './compatibility.engine';
import { WaterQualityEngine } from './water-quality.engine';
import { SuggestionTankIdeaEngine } from './suggestion-tank-idea.engine';
import { FishSpeciesEngine } from './fish-species.engine';

/**
 * EnginesModule - Provides pure business logic engines
 *
 * Following IDesign (Righting Software) principles:
 * - Engines contain pure logic (no I/O)
 * - Engines are reusable across Managers
 * - Engines encapsulate "logic volatility"
 * @Global() - Available app-wide without explicit imports
 */
const Engines = [
  BioloadEngine,
  CompatibilityEngine,
  WaterQualityEngine,
  SuggestionTankIdeaEngine,
  FishSpeciesEngine
];
@Global()
@Module({
  providers: Engines,
  exports: Engines,
})
export class EnginesModule { }
