import { Injectable } from '@nestjs/common';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { UserSubscription } from '../entities/user-subscription.entity';
import type { IUserSubscriptionAccessor } from '../contracts/user-subscription.accessor.interface';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@Injectable()
export class UserSubscriptionAccessor
  extends BaseDbAccessor
  implements IUserSubscriptionAccessor
{
  async findActiveByUserId(userId: number): Promise<UserSubscription | null> {
    return this.em.findOne(
      UserSubscription,
      { userId, status: SubscriptionStatus.ACTIVE },
      { populate: ['package'] },
    );
  }

  async findByUserId(userId: number): Promise<UserSubscription[]> {
    return this.em.find(
      UserSubscription,
      { userId },
      { populate: ['package'], orderBy: { createdAt: 'DESC' } },
    );
  }

  async save(sub: UserSubscription): Promise<UserSubscription> {
    await this.em.persist(sub).flush();
    return sub;
  }

  async update(id: number, sub: UserSubscription): Promise<UserSubscription> {
    this.em.assign(sub, { id });
    await this.em.flush();
    return sub;
  }
}
