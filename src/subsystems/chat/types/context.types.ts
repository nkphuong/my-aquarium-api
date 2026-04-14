import { Tank } from '@subsystems/aquarium/entities/tank.entity';
import { Fish } from '@subsystems/aquarium/entities/fish.entity';
import { FishSpecies } from '@subsystems/aquarium/entities/fish-species.entity';
import { Livestock } from '@subsystems/aquarium/entities/livestock.entity';
import { WaterParameter } from '@subsystems/aquarium/entities/water-parameter.entity';

export interface UserAquariumContext {
  tanks: Tank[];
  fishByTank: Map<number, Fish[]>;
  livestockByTank: Map<number, Livestock[]>;
  latestWaterParams: Map<number, WaterParameter | null>;
  fishSpecies: FishSpecies[];
}

export interface AIInsight {
  id: string;
  priority: 'info' | 'suggestion' | 'warning' | 'critical';
  title: string;
  description: string;
  tankId?: number;
  tankName?: string;
  actionLabel: string;
}

export interface TopicCheckResult {
  allowed: boolean;
  redirectMessage?: string;
}
