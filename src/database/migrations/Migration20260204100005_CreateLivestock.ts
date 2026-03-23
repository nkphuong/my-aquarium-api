import { Migration } from '@mikro-orm/migrations';

export class Migration20260204100005_CreateLivestock extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "livestock" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "tank_id" bigint null, "name" varchar(255) not null, "scientific_name" varchar(255) null, "fishbase_id" int null, "type" varchar(255) not null, "quantity" int not null default 1, "status" varchar(255) not null, "image_url" text null, "added_date" date not null default now());`,
    );
    this.addSql(
      `alter table "livestock" add constraint "livestock_tank_id_fkey" foreign key ("tank_id") references "tanks" ("id") on update cascade on delete cascade;`,
    );
  }
}
