import {
  Entity,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@core/entity/base.entity';
import { Role } from './role.entity';

@Entity({ tableName: 'admin_role_assignments' })
@Unique({ properties: ['adminId', 'role'] })
export class AdminRoleAssignment extends BaseEntity {
  @Property({ name: 'admin_id', type: 'bigint' })
  adminId!: number;

  @ManyToOne(() => Role, { name: 'role_id' })
  role!: Role;
}
