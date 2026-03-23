import { Migration } from '@mikro-orm/migrations';

export class Migration20260204100007_CreateMedia extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "media" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "url" text not null, "type" varchar(20) not null, "status" varchar(20) not null);`,
    );
  }

}
