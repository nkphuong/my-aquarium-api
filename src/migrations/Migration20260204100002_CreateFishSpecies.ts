import { Migration } from '@mikro-orm/migrations';

export class Migration20260204100002_CreateFishSpecies extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "fish_species" ("id" bigserial primary key, "create_at" timestamptz not null, "update_at" timestamptz not null, "name_en" varchar(255) not null, "name_vn" varchar(255) not null, "scientific_name" varchar(255) null, "aliases" text[] not null, "image_url" varchar(255) null, "temp_min" real not null, "temp_max" real not null, "ph_min" real not null, "ph_max" real not null, "gh_min" int null, "gh_max" int null, "min_tank_size" int not null, "size_max" real not null, "bioload_level" int not null default 5, "flow_preference" varchar(255) not null default 'moderate', "care_level" varchar(255) not null, "temperament" varchar(255) not null, "diet_type" varchar(255) not null, "is_schooling" boolean not null default false, "min_school_size" int null default 1, "plant_safe" boolean not null default true, "substrate_digger" boolean not null default false, "jumper" boolean not null default false, "description" text not null);`,
    );
    this.addSql(
      `alter table "fish_species" add constraint "fish_species_name_en_unique" unique ("name_en");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "fish_species" cascade;`);
  }
}
