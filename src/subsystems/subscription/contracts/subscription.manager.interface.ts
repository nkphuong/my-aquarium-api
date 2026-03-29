import { UserSubscription } from '../entities/user-subscription.entity';
import { ServiceTier } from '../dtos/service-tier.dto';

export interface ISubscriptionManager {
  resolveUserServiceTier(userId: number): Promise<ServiceTier>;
  subscribe(userId: number, packageSlug: string): Promise<UserSubscription>;
  cancelSubscription(userId: number): Promise<void>;
}

export const SUBSCRIPTION_MANAGER = Symbol('ISubscriptionManager');
