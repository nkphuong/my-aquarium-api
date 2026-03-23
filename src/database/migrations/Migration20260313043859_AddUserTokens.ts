import { Migration } from '@mikro-orm/migrations';

export class Migration20260313043859_AddUserTokens extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "user_tokens" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "tokenable_id" int not null, "tokenable_type" varchar(255) not null, "type" varchar(255) not null, "token_hash" varchar(255) not null, "expires_at" timestamptz not null);');
    this.addSql('alter table "users" drop column "refresh_token_hash";');
  }



}
