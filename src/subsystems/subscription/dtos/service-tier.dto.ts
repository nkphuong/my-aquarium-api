export class ServiceTier {
  packageSlug: string | null = null;
  features: Map<string, string | number | boolean> = new Map();

  hasFeature(key: string): boolean {
    const val = this.features.get(key);
    return val === true || val === 'true';
  }

  getNumericLimit(key: string, defaultValue: number = 0): number {
    const val = this.features.get(key);
    if (typeof val === 'number') return val;
    const parsed = Number(val);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  get queuePriority(): number {
    return this.getNumericLimit('queue-priority', 10);
  }

  get maxTanks(): number {
    return this.getNumericLimit('max-tanks', 3);
  }

  get aiCallsPerMonth(): number {
    return this.getNumericLimit('ai-calls-per-month', 0);
  }

  static free(): ServiceTier {
    return new ServiceTier();
  }
}
