import { Migration } from '@mikro-orm/migrations';

export class Migration20260323093034 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "tanks" drop constraint "tanks_user_id_fkey";`);

    this.addSql(`create table "packages" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "slug" varchar(255) not null, "description" text null, "is_active" boolean not null default true, "sort_order" int not null default 0);`);
    this.addSql(`alter table "packages" add constraint "packages_name_unique" unique ("name");`);
    this.addSql(`alter table "packages" add constraint "packages_slug_unique" unique ("slug");`);

    this.addSql(`create table "package_features" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "package_id" bigint not null, "feature_key" varchar(255) not null, "value" text not null);`);

    this.addSql(`create table "roles" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "slug" varchar(255) not null, "description" text null);`);
    this.addSql(`alter table "roles" add constraint "roles_name_unique" unique ("name");`);
    this.addSql(`alter table "roles" add constraint "roles_slug_unique" unique ("slug");`);

    this.addSql(`create table "permissions" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "slug" varchar(255) not null, "group" varchar(50) not null);`);
    this.addSql(`alter table "permissions" add constraint "permissions_name_unique" unique ("name");`);
    this.addSql(`alter table "permissions" add constraint "permissions_slug_unique" unique ("slug");`);

    this.addSql(`create table "role_permissions" ("roles_id" bigint not null, "permissions_id" bigint not null, primary key ("roles_id", "permissions_id"));`);

    this.addSql(`create table "user_subscriptions" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" bigint not null, "package_id" bigint not null, "status" varchar(20) not null, "starts_at" timestamptz not null, "expires_at" timestamptz null);`);

    this.addSql(`alter table "package_features" add constraint "package_features_package_id_foreign" foreign key ("package_id") references "packages" ("id");`);

    this.addSql(`alter table "role_permissions" add constraint "role_permissions_roles_id_foreign" foreign key ("roles_id") references "roles" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permissions_id_foreign" foreign key ("permissions_id") references "permissions" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user_subscriptions" add constraint "user_subscriptions_package_id_foreign" foreign key ("package_id") references "packages" ("id");`);


    this.addSql(`create table "admin_role_assignments" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "admin_id" bigint not null, "role_id" bigint not null);`);
    this.addSql(`alter table "admin_role_assignments" add constraint "admin_role_assignments_admin_id_role_id_unique" unique ("admin_id", "role_id");`);
    this.addSql(`alter table "admin_role_assignments" add constraint "admin_role_assignments_admin_id_foreign" foreign key ("admin_id") references "admins" ("id") on delete cascade;`);
    this.addSql(`alter table "admin_role_assignments" add constraint "admin_role_assignments_role_id_foreign" foreign key ("role_id") references "roles" ("id") on delete cascade;`);


  }



}
