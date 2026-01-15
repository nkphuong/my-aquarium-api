import { BaseEntity } from './base.entity';
import { TankDimensions, TankType } from '../enums/tank.enum';

export class Tank extends BaseEntity {
  private _name: string;
  private _dimensions?: TankDimensions;
  private _user_id?: number;
  private _tank_type?: string; // Stored as string, but logically compatible with TankType
  private _style?: string;
  private _description?: string;
  private _setup_date?: Date;
  private _volume_liters?: number;
  private _cover_image_url?: string;
  private _substrate?: string;
  private _filter_type?: string;
  private _is_archived: boolean;

  constructor(
    id: number,
    name: string,
    dimensions?: TankDimensions,
    tank_type?: string,
    style?: string,
    description?: string,
    setup_date?: Date,
    volume_liters?: number,
    cover_image_url?: string,
    substrate?: string,
    filter_type?: string,
    is_archived: boolean = false,
    user_id?: number,
    created_at?: Date,
    updated_at?: Date,
  ) {
    super(id, created_at, updated_at);
    this._name = name;
    this._dimensions = dimensions;
    this._tank_type = tank_type;
    this._style = style;
    this._description = description;
    this._setup_date = setup_date;
    this._volume_liters = volume_liters;
    this._cover_image_url = cover_image_url;
    this._substrate = substrate;
    this._filter_type = filter_type;
    this._is_archived = is_archived;
    this._user_id = user_id;
  }

  get name(): string {
    return this._name;
  }

  get dimensions(): TankDimensions | undefined {
    return this._dimensions;
  }

  get tank_type(): string | undefined {
    return this._tank_type;
  }

  get style(): string | undefined {
    return this._style;
  }

  get description(): string | undefined {
    return this._description;
  }

  get setup_date(): Date | undefined {
    return this._setup_date;
  }

  get volume_liters(): number | undefined {
    return this._volume_liters;
  }

  get cover_image_url(): string | undefined {
    return this._cover_image_url;
  }

  get substrate(): string | undefined {
    return this._substrate;
  }

  get filter_type(): string | undefined {
    return this._filter_type;
  }

  get is_archived(): boolean {
    return this._is_archived;
  }

  get user_id(): number | undefined {
    return this._user_id;
  }

  updateDimensions(dimensions: TankDimensions): void {
    this._dimensions = dimensions;
    this.touch();
  }

  updateName(name: string): void {
    this._name = name;
    this.touch();
  }

  assignToUser(user_id: number): void {
    this._user_id = user_id;
    this.touch();
  }

  removeFromUser(): void {
    this._user_id = undefined;
    this.touch();
  }

  updateTankType(type: string): void {
    this._tank_type = type;
    this.touch();
  }

  updateStyle(style: string): void {
    this._style = style;
    this.touch();
  }

  updateDescription(description: string): void {
    this._description = description;
    this.touch();
  }

  updateSetupDate(setup_date: Date): void {
    this._setup_date = setup_date;
    this.touch();
  }

  updateVolumeLiters(volume_liters: number): void {
    this._volume_liters = volume_liters;
    this.touch();
  }

  updateCoverImageUrl(url: string): void {
    this._cover_image_url = url;
    this.touch();
  }

  updateSubstrate(substrate: string): void {
    this._substrate = substrate;
    this.touch();
  }

  updateFilterType(filterType: string): void {
    this._filter_type = filterType;
    this.touch();
  }

  archive(): void {
    this._is_archived = true;
    this.touch();
  }

  unarchive(): void {
    this._is_archived = false;
    this.touch();
  }
}
