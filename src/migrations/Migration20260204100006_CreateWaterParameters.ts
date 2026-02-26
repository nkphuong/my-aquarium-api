import { Migration } from '@mikro-orm/migrations';

export class Migration20260204100006_CreateWaterParameters extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "water_parameters" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "tank_id" bigint not null, "tested_at" date not null default now(), "temperature" decimal(4,1) null, "ph" decimal(3,1) null, "ammonia" decimal(5,3) null, "nitrite" decimal(5,3) null, "nitrate" decimal(6,2) null, "gh" decimal(5,1) null, "kh" decimal(5,1) null, "notes" text null);`,
    );
    this.addSql(
      `alter table "water_parameters" add constraint "water_parameters_tank_id_fkey" foreign key ("tank_id") references "tanks" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "water_parameters" cascade;`);
  }
}
