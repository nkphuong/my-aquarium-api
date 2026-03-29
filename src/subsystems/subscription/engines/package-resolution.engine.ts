import { Injectable } from '@nestjs/common';
import { UserSubscription } from '../entities/user-subscription.entity';
import { PackageFeature } from '../entities/package-feature.entity';
import { ServiceTier } from '../dtos/service-tier.dto';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

/**
 * PackageResolutionEngine - Pure business logic for resolving user service tiers
 *
 * Follows IDesign principles:
 * - NO I/O (no Accessor calls)
 * - Pure calculation logic only
 */
@Injectable()
export class PackageResolutionEngine {
  resolve(
    subscription: UserSubscription | null,
    features: PackageFeature[],
  ): ServiceTier {
    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      return ServiceTier.free();
    }

    if (subscription.expiresAt && subscription.expiresAt < new Date()) {
      return ServiceTier.free();
    }

    const tier = new ServiceTier();
    tier.packageSlug = subscription.package?.slug ?? null;

    for (const f of features) {
      tier.features.set(f.featureKey, this.parseValue(f.value));
    }

    return tier;
  }

  private parseValue(raw: string): string | number | boolean {
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    const num = Number(raw);
    if (!isNaN(num) && raw.trim() !== '') return num;
    return raw;
  }
}
