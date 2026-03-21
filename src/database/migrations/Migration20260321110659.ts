import { Migration } from '@mikro-orm/migrations';

export class Migration20260321110659 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" add "verified_at" timestamptz null;`);

    this.addSql(`alter table "user_tokens" alter column "type" type varchar(255) using ("type"::varchar(255));`);
    this.addSql(`alter table "user_tokens" alter column "tokenable_id" type bigint using ("tokenable_id"::bigint);`);
    this.addSql(`alter table "user_tokens" add constraint "user_tokens_tokenable_id_foreign" foreign key ("tokenable_id") references "users" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "user_tokens" drop constraint "user_tokens_tokenable_id_foreign";`);

    this.addSql(`alter table "users" drop column "verified_at";`);

    this.addSql(`alter table "user_tokens" alter column "type" type text using ("type"::text);`);
    this.addSql(`alter table "user_tokens" alter column "tokenable_id" type int using ("tokenable_id"::int);`);
  }

}
