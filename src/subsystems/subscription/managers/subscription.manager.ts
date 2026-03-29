import { Injectable, Inject } from '@nestjs/common';
import type { ISubscriptionManager } from '../contracts/subscription.manager.interface';
import type { IUserSubscriptionAccessor } from '../contracts/user-subscription.accessor.interface';
import { USER_SUBSCRIPTION_ACCESSOR } from '../contracts/user-subscription.accessor.interface';
import type { IPackageAccessor } from '../contracts/package.accessor.interface';
import { PACKAGE_ACCESSOR } from '../contracts/package.accessor.interface';
import type { IPackageFeatureAccessor } from '../contracts/package-feature.accessor.interface';
import { PACKAGE_FEATURE_ACCESSOR } from '../contracts/package-feature.accessor.interface';
import { PackageResolutionEngine } from '../engines/package-resolution.engine';
import { ServiceTier } from '../dtos/service-tier.dto';
import { UserSubscription } from '../entities/user-subscription.entity';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { PackageNotFoundException } from '../exceptions/package-not-found.exception';
import { SubscriptionNotFoundException } from '../exceptions/subscription-not-found.exception';

@Injectable()
export class SubscriptionManager implements ISubscriptionManager {
  constructor(
    @Inject(USER_SUBSCRIPTION_ACCESSOR)
    private readonly userSubscriptionAccessor: IUserSubscriptionAccessor,
    @Inject(PACKAGE_ACCESSOR)
    private readonly packageAccessor: IPackageAccessor,
    @Inject(PACKAGE_FEATURE_ACCESSOR)
    private readonly packageFeatureAccessor: IPackageFeatureAccessor,
    private readonly packageResolutionEngine: PackageResolutionEngine,
  ) {}

  async resolveUserServiceTier(userId: number): Promise<ServiceTier> {
    const subscription =
      await this.userSubscriptionAccessor.findActiveByUserId(userId);

    if (!subscription) {
      return ServiceTier.free();
    }

    const features = await this.packageFeatureAccessor.findByPackageId(
      subscription.package.id,
    );
    return this.packageResolutionEngine.resolve(subscription, features);
  }

  async subscribe(
    userId: number,
    packageSlug: string,
  ): Promise<UserSubscription> {
    const pkg = await this.packageAccessor.findBySlug(packageSlug);
    if (!pkg) {
      throw new PackageNotFoundException(packageSlug);
    }

    const existing =
      await this.userSubscriptionAccessor.findActiveByUserId(userId);
    if (existing) {
      existing.status = SubscriptionStatus.CANCELLED;
      await this.userSubscriptionAccessor.update(existing.id, existing);
    }

    const sub = new UserSubscription();
    sub.fill({
      userId,
      package: pkg,
      status: SubscriptionStatus.ACTIVE,
      startsAt: new Date(),
    } as any);

    return this.userSubscriptionAccessor.save(sub);
  }

  async cancelSubscription(userId: number): Promise<void> {
    const sub = await this.userSubscriptionAccessor.findActiveByUserId(userId);
    if (!sub) {
      throw new SubscriptionNotFoundException(userId);
    }
    sub.status = SubscriptionStatus.CANCELLED;
    await this.userSubscriptionAccessor.update(sub.id, sub);
  }
}
