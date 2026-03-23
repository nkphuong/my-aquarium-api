import {
  Entity,
  Property,
  PrimaryKey,
  ManyToOne,
} from '@mikro-orm/decorators/legacy';
import { User } from './user.entity';
import { Admin } from './admin.entity';

@Entity({ tableName: 'user_tokens' })
export class UserToken {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255 })
  tokenHash!: string;

  @Property()
  type!: string;

  @Property()
  tokenableType!: string;

  @ManyToOne(() => [User, Admin], { fieldName: 'tokenable_id' })
  tokenable!: User | Admin;

  @Property({ nullable: true })
  userAgent?: string;

  @Property({ nullable: true })
  ipAddress?: string;

  @Property()
  expiresAt!: Date;

  @Property()
  createdAt: Date = new Date();
}
