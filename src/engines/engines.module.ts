import { Module, Global } from '@nestjs/common';
import { BioloadEngine } from './bioload.engine';
import { CompatibilityEngine } from './compatibility.engine';
import { WaterQualityEngine } from './water-quality.engine';

/**
 * EnginesModule - Provides pure business logic engines
 *
 * Following IDesign (Righting Software) principles:
 * - Engines contain pure logic (no I/O)
 * - Engines are reusable across Managers
 * - Engines encapsulate "logic volatility"
 * @Global() - Available app-wide without explicit imports
 */
@Global()
@Module({
  providers: [BioloadEngine, CompatibilityEngine, WaterQualityEngine],
  exports: [BioloadEngine, CompatibilityEngine, WaterQualityEngine],
})
export class EnginesModule {}
