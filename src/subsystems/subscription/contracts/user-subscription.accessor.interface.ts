import { UserSubscription } from '../entities/user-subscription.entity';

export interface IUserSubscriptionAccessor {
  findActiveByUserId(userId: number): Promise<UserSubscription | null>;
  findByUserId(userId: number): Promise<UserSubscription[]>;
  save(sub: UserSubscription): Promise<UserSubscription>;
  update(id: number, sub: UserSubscription): Promise<UserSubscription>;
}

export const USER_SUBSCRIPTION_ACCESSOR = Symbol('IUserSubscriptionAccessor');
