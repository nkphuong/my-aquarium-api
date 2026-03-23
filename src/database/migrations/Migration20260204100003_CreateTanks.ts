import { Migration } from '@mikro-orm/migrations';

export class Migration20260204100003_CreateTanks extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "tanks" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "volume_liters" decimal(10,2) null, "user_id" bigint null, "width" int null, "length" int null, "height" int null, "tank_type" varchar(255) null, "style" varchar(255) null, "substrate" varchar(255) null, "filter_type" varchar(255) null, "cover_image_url" text null, "description" text null, "setup_date" date null, "is_archived" boolean not null default false);`,
    );
    this.addSql(
      `alter table "tanks" add constraint "tanks_user_id_fkey" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`,
    );
  }

}
