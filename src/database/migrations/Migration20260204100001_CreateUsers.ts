import { Migration } from '@mikro-orm/migrations';

export class Migration20260204100001_CreateUsers extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "users" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password" varchar(255) not null, "fullname" varchar(255) null, "refresh_token_hash" varchar(255) null);`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );
  }


}
