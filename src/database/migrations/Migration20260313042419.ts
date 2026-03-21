import { Migration } from '@mikro-orm/migrations';

export class Migration20260313042419 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_tokens" ("id" serial primary key, "token_hash" varchar(255) not null, "type" text check ("type" in ('refresh', 'access')) not null, "tokenable_type" varchar(255) not null, "tokenable_id" int not null, "user_agent" varchar(255) null, "ip_address" varchar(255) null, "expires_at" timestamptz not null, "created_at" timestamptz not null);`);

    this.addSql(`alter table "users" drop column "refresh_token_hash";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_tokens" cascade;`);

    this.addSql(`alter table "users" add column "refresh_token_hash" varchar(255) null;`);
  }

}
