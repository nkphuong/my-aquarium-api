import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@core/entity/base.entity';

@Entity({ tableName: 'media' })
export class Media extends BaseEntity {
  @Property({ type: 'text' })
  url!: string;

  @Property({ length: 20 })
  type!: string;

  @Property({ length: 20 })
  status!: string;
}
