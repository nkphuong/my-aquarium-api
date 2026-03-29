import { Entity, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@core/entity/base.entity';
import { Package } from './package.entity';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@Entity({ tableName: 'user_subscriptions' })
export class UserSubscription extends BaseEntity {
  @Property({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @ManyToOne(() => Package, { name: 'package_id' })
  package!: Package;

  @Property({ columnType: 'varchar(20)' })
  status!: SubscriptionStatus;

  @Property({ name: 'starts_at' })
  startsAt!: Date;

  @Property({ name: 'expires_at', nullable: true })
  expiresAt?: Date;
}
