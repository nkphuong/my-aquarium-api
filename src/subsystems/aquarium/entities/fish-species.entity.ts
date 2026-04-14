import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from '@core/entity/base.entity';

/**
 * FishSpecies domain entity
 * Reference data entity, mostly read-only
 */
@Entity({ tableName: 'fish_species' })
export class FishSpecies extends BaseEntity {
  // Use BaseEntity id definition (BigInt type mapped to number)
  // If schema diff occurs allow it or handle in BaseEntity
  // override id!: number; // Removing this to fix build

  @Property({ name: 'create_at' })
  override createdAt: Date = new Date();

  @Property({ name: 'update_at', onUpdate: () => new Date() })
  override updatedAt: Date = new Date();

  // --- 1. IDENTITY ---
  @Property({ unique: true })
  name_en!: string;

  @Property()
  name_vn!: string;

  @Property({ nullable: true })
  scientific_name?: string;

  @Property({ type: 'array' })
  aliases: string[] = [];

  @Property({ nullable: true })
  image_url?: string;

  // --- 2. WATER PARAMETERS ---
  @Property({ type: 'float' })
  temp_min!: number;

  @Property({ type: 'float' })
  temp_max!: number;

  @Property({ type: 'float' })
  ph_min!: number;

  @Property({ type: 'float' })
  ph_max!: number;

  @Property({ nullable: true })
  gh_min?: number;

  @Property({ nullable: true })
  gh_max?: number;

  // --- 3. TANK REQUIREMENTS ---
  @Property()
  min_tank_size!: number;

  @Property({ type: 'float' })
  size_max!: number;

  @Property({ default: 5 })
  bioload_level: number = 5;

  @Property({ default: 'moderate' })
  flow_preference: string = 'moderate';

  // --- 4. BEHAVIOR & COMPATIBILITY ---
  @Property()
  care_level!: string;

  @Property()
  temperament!: string;

  @Property()
  diet_type!: string;

  @Property({ default: false })
  is_schooling: boolean = false;

  @Property({ nullable: true, default: 1 })
  min_school_size?: number = 1;

  @Property({ default: true })
  plant_safe: boolean = true;

  @Property({ default: false })
  substrate_digger: boolean = false;

  @Property({ default: false })
  jumper: boolean = false;

  @Property({ default: 'all' })
  water_level: string = 'all';

  @Property({ type: 'text', nullable: true })
  care_notes_vn?: string;

  // --- 5. AI & SEARCH ---
  @Property({ type: 'text' })
  description!: string;
}
