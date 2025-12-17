import { BaseEntity } from './base.entity';

export class Tank extends BaseEntity {
  private _name: string;
  private _width: number;
  private _height: number;
  private _length: number;
  private _user_id?: number;
  private _type?: string;
  private _style?: string;
  private _description?: string;
  private _status?: string;
  private _setup_at?: Date;
  private _water_volume?: number;
  private _avatar?: string;


  constructor(
    id: number,
    name: string,
    width: number,
    height: number,
    length: number,
    type?: string,
    style?: string,
    description?: string,
    status?: string,
    setup_at?: Date,
    water_volume?: number,
    avatar?: string,
    user_id?: number,
    created_at?: Date,
    updated_at?: Date,
  ) {
    super(id, created_at, updated_at);
    this._name = name;
    this._width = width;
    this._height = height;
    this._length = length;
    this._type = type;
    this._style = style;
    this._description = description;
    this._status = status;
    this._setup_at = setup_at;
    this._water_volume = water_volume;
    this._avatar = avatar;
    this._user_id = user_id;
  }

  get name(): string {
    return this._name;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get length(): number {
    return this._length;
  }

  get type(): string | undefined {
    return this._type;
  }

  get style(): string | undefined {
    return this._style;
  }

  get description(): string | undefined {
    return this._description;
  }

  get status(): string | undefined {
    return this._status;
  }

  get setup_at(): Date | undefined {
    return this._setup_at;
  }

  get water_volume(): number | undefined {
    return this._water_volume;
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  get user_id(): number | undefined {
    return this._user_id;
  }

  updateDimensions(width: number, height: number, length: number): void {
    this._width = width;
    this._height = height;
    this._length = length;
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

  updateType(type: string): void {
    this._type = type;
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

  updateStatus(status: string): void {
    this._status = status;
    this.touch();
  }

  updateSetupAt(setup_at: Date): void {
    this._setup_at = setup_at;
    this.touch();
  }

  updateWaterVolume(water_volume: number): void {
    this._water_volume = water_volume;
    this.touch();
  }

  updateAvatar(avatar: string): void {
    this._avatar = avatar;
    this.touch();
  }

}
