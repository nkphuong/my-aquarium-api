import { Migration } from '@mikro-orm/migrations';

export class Migration20260323044658 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "admins" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password" varchar(255) not null, "fullname" varchar(255) null, "verified_at" timestamptz null);`);
    this.addSql(`alter table "admins" add constraint "admins_email_unique" unique ("email");`);
  }

}
