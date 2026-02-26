import { Migration } from '@mikro-orm/migrations';

export class Migration20260204100004_CreateFishes extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "fishes" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "species" varchar(255) not null, "tank_id" bigint null);`,
    );
    this.addSql(
      `alter table "fishes" add constraint "fishes_tank_id_fkey" foreign key ("tank_id") references "tanks" ("id") on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "fishes" cascade;`);
  }
}
