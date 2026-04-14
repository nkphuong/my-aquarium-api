import { Migration } from '@mikro-orm/migrations';

export class Migration20260409090032 extends Migration {

  override async up(): Promise<void> {
    // Schema changes detected from entity diff
    this.addSql(`alter table "roles" add column if not exists "is_super_admin" boolean not null default false;`);
    this.addSql(`alter table "admins" add column if not exists "last_login_at" timestamptz null;`);
    this.addSql(`alter table "users" add column if not exists "status" text not null default 'active';`);
    this.addSql(`alter table "users" add column if not exists "last_login_at" timestamptz null;`);

    // Add water_level and care_notes_vn to fish_species
    this.addSql(`alter table "fish_species" add column if not exists "water_level" varchar(255) not null default 'all';`);
    this.addSql(`alter table "fish_species" add column if not exists "care_notes_vn" text null;`);

    // Create compatibility_overrides table
    this.addSql(`create table if not exists "compatibility_overrides" ("id" bigserial primary key, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "species_a_id" int not null, "species_b_id" int not null, "verdict" varchar(255) not null, "reason_vn" text not null, "reason_en" text not null, "source" varchar(255) not null default 'manual');`);
    this.addSql(`alter table "compatibility_overrides" add constraint "compatibility_overrides_species_a_id_species_b_id_unique" unique ("species_a_id", "species_b_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "compatibility_overrides" cascade;`);
    this.addSql(`alter table "fish_species" drop column if exists "water_level";`);
    this.addSql(`alter table "fish_species" drop column if exists "care_notes_vn";`);
    this.addSql(`alter table "roles" drop column if exists "is_super_admin";`);
    this.addSql(`alter table "admins" drop column if exists "last_login_at";`);
    this.addSql(`alter table "users" drop column if exists "status";`);
    this.addSql(`alter table "users" drop column if exists "last_login_at";`);
  }

}
