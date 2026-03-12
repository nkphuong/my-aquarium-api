import { Injectable } from '@nestjs/common';
import { WaterParameter } from '@entities/water-parameter.entity';
import { FishSpecies } from '@entities/fish-species.entity';

export interface WaterHealthAnalysis {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
}

export interface WaterChangePrediction {
  daysUntilNeeded: number;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
}

export interface ParameterCheck {
  parameter: string;
  value: number | null;
  status: 'ok' | 'warning' | 'danger';
  message?: string;
}

/**
 * WaterQualityEngine - Pure business logic for water quality analysis
 *
 * Follows IDesign principles:
 * - NO I/O (no Accessor calls)
 * - Pure calculation logic only
 * - Reusable across multiple Managers
 */
@Injectable()
export class WaterQualityEngine {
  // Safe thresholds for common aquarium parameters
  private readonly THRESHOLDS = {
    ammonia: { safe: 0, warning: 0.25, danger: 0.5 },
    nitrite: { safe: 0, warning: 0.25, danger: 0.5 },
    nitrate: { safe: 20, warning: 40, danger: 80 },
  };

  /**
   * Analyze water health based on parameters and fish species
   */
  analyzeWaterHealth(
    params: WaterParameter,
    species: FishSpecies[] = [],
  ): WaterHealthAnalysis {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check nitrogen cycle parameters (most critical)
    const ammoniaCheck = this.checkAmmonia(params);
    if (ammoniaCheck.status === 'danger') {
      score -= 40;
      issues.push(ammoniaCheck.message!);
      recommendations.push('Perform immediate 50% water change');
    } else if (ammoniaCheck.status === 'warning') {
      score -= 20;
      issues.push(ammoniaCheck.message!);
      recommendations.push('Monitor closely, tank may be cycling');
    }

    const nitriteCheck = this.checkNitrite(params);
    if (nitriteCheck.status === 'danger') {
      score -= 35;
      issues.push(nitriteCheck.message!);
      recommendations.push('Perform 50% water change immediately');
    } else if (nitriteCheck.status === 'warning') {
      score -= 15;
      issues.push(nitriteCheck.message!);
    }

    const nitrateCheck = this.checkNitrate(params);
    if (nitrateCheck.status === 'danger') {
      score -= 25;
      issues.push(nitrateCheck.message!);
      recommendations.push('Increase water change frequency');
    } else if (nitrateCheck.status === 'warning') {
      score -= 10;
      issues.push(nitrateCheck.message!);
      recommendations.push('Consider adding live plants to reduce nitrates');
    }

    // Check pH and temp against species requirements
    for (const s of species) {
      const ph = this.toNumber(params.ph);
      if (ph !== null && (ph < s.ph_min || ph > s.ph_max)) {
        score -= 10;
        issues.push(
          `pH ${ph} outside range for ${s.name_en} (${s.ph_min}-${s.ph_max})`,
        );
      }

      const temp = this.toNumber(params.temperature);
      if (temp !== null && (temp < s.temp_min || temp > s.temp_max)) {
        score -= 10;
        issues.push(
          `Temperature ${temp}°C outside range for ${s.name_en} (${s.temp_min}-${s.temp_max}°C)`,
        );
      }
    }

    score = Math.max(0, score);

    return {
      score,
      status: this.scoreToStatus(score),
      issues,
      recommendations,
    };
  }

  /**
   * Check all parameters and return individual status
   */
  checkAllParameters(params: WaterParameter): ParameterCheck[] {
    return [
      this.checkAmmonia(params),
      this.checkNitrite(params),
      this.checkNitrate(params),
      this.checkPH(params),
      this.checkTemperature(params),
    ];
  }

  /**
   * Predict when next water change is needed based on nitrate trend
   */
  predictNextWaterChange(
    recentParams: WaterParameter[],
    tankVolume: number,
  ): WaterChangePrediction {
    if (recentParams.length < 2) {
      return {
        daysUntilNeeded: 7,
        urgency: 'low',
        reason: 'Not enough data - using default weekly schedule',
      };
    }

    // Sort by date ascending
    const sorted = [...recentParams].sort(
      (a, b) =>
        new Date(a.tested_at).getTime() - new Date(b.tested_at).getTime(),
    );

    const oldest = sorted[0];
    const newest = sorted[sorted.length - 1];

    const daysBetween =
      (new Date(newest.tested_at).getTime() -
        new Date(oldest.tested_at).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysBetween < 1) {
      return {
        daysUntilNeeded: 7,
        urgency: 'low',
        reason: 'Tests too close together - using default schedule',
      };
    }

    const oldNitrate = this.toNumber(oldest.nitrate) ?? 0;
    const newNitrate = this.toNumber(newest.nitrate) ?? 0;
    const nitrateIncrease = newNitrate - oldNitrate;
    const dailyRate = nitrateIncrease / daysBetween;

    // If nitrate is stable or decreasing
    if (dailyRate <= 0) {
      return {
        daysUntilNeeded: 14,
        urgency: 'low',
        reason: 'Nitrate levels are stable or decreasing',
      };
    }

    // Calculate days until danger threshold
    const dangerThreshold = this.THRESHOLDS.nitrate.danger;
    const daysUntilDanger = (dangerThreshold - newNitrate) / dailyRate;
    const daysUntilChange = Math.max(1, Math.floor(daysUntilDanger * 0.7));

    let urgency: 'low' | 'medium' | 'high';
    if (daysUntilChange <= 2) urgency = 'high';
    else if (daysUntilChange <= 5) urgency = 'medium';
    else urgency = 'low';

    return {
      daysUntilNeeded: daysUntilChange,
      urgency,
      reason: `Nitrate increasing at ${dailyRate.toFixed(2)} ppm/day`,
    };
  }

  // === Private helpers ===

  private checkAmmonia(params: WaterParameter): ParameterCheck {
    const value = this.toNumber(params.ammonia);
    if (value === null) {
      return { parameter: 'ammonia', value: null, status: 'ok' };
    }
    if (value >= this.THRESHOLDS.ammonia.danger) {
      return {
        parameter: 'ammonia',
        value,
        status: 'danger',
        message: `Dangerous ammonia level: ${value} ppm`,
      };
    }
    if (value >= this.THRESHOLDS.ammonia.warning) {
      return {
        parameter: 'ammonia',
        value,
        status: 'warning',
        message: `Ammonia detected: ${value} ppm`,
      };
    }
    return { parameter: 'ammonia', value, status: 'ok' };
  }

  private checkNitrite(params: WaterParameter): ParameterCheck {
    const value = this.toNumber(params.nitrite);
    if (value === null) {
      return { parameter: 'nitrite', value: null, status: 'ok' };
    }
    if (value >= this.THRESHOLDS.nitrite.danger) {
      return {
        parameter: 'nitrite',
        value,
        status: 'danger',
        message: `Dangerous nitrite level: ${value} ppm`,
      };
    }
    if (value >= this.THRESHOLDS.nitrite.warning) {
      return {
        parameter: 'nitrite',
        value,
        status: 'warning',
        message: `Nitrite detected: ${value} ppm`,
      };
    }
    return { parameter: 'nitrite', value, status: 'ok' };
  }

  private checkNitrate(params: WaterParameter): ParameterCheck {
    const value = this.toNumber(params.nitrate);
    if (value === null) {
      return { parameter: 'nitrate', value: null, status: 'ok' };
    }
    if (value >= this.THRESHOLDS.nitrate.danger) {
      return {
        parameter: 'nitrate',
        value,
        status: 'danger',
        message: `Very high nitrate: ${value} ppm`,
      };
    }
    if (value >= this.THRESHOLDS.nitrate.warning) {
      return {
        parameter: 'nitrate',
        value,
        status: 'warning',
        message: `High nitrate: ${value} ppm`,
      };
    }
    return { parameter: 'nitrate', value, status: 'ok' };
  }

  private checkPH(params: WaterParameter): ParameterCheck {
    const value = this.toNumber(params.ph);
    if (value === null) {
      return { parameter: 'pH', value: null, status: 'ok' };
    }
    if (value < 6.0 || value > 8.5) {
      return {
        parameter: 'pH',
        value,
        status: 'warning',
        message: `pH ${value} is outside normal range (6.0-8.5)`,
      };
    }
    return { parameter: 'pH', value, status: 'ok' };
  }

  private checkTemperature(params: WaterParameter): ParameterCheck {
    const value = this.toNumber(params.temperature);
    if (value === null) {
      return { parameter: 'temperature', value: null, status: 'ok' };
    }
    if (value < 18 || value > 32) {
      return {
        parameter: 'temperature',
        value,
        status: 'warning',
        message: `Temperature ${value}°C is outside normal range (18-32°C)`,
      };
    }
    return { parameter: 'temperature', value, status: 'ok' };
  }

  private scoreToStatus(
    score: number,
  ): 'excellent' | 'good' | 'warning' | 'critical' {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'warning';
    return 'critical';
  }

  private toNumber(value: any): number | null {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }
}
