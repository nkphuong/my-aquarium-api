import { BaseEntity } from './base.entity';

export class Tank extends BaseEntity {
  private _name: string;
  private _width: number;
  private _height: number;
  private _length: number;
  private _user_id?: number;


  constructor(
    id: number,
    name: string,
    width: number,
    height: number,
    length: number,
    user_id?: number,
    created_at?: Date,
    updated_at?: Date,
  ) {
    super(id, created_at, updated_at);
    this._name = name;
    this._width = width;
    this._height = height;
    this._length = length;
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

  get user_id(): number | undefined {
    return this._user_id;
  }

  assignToUser(user_id: number): void {
    this._user_id = user_id;
    this.touch();
  }
  
  removeFromUser(): void {
    this._user_id = undefined;
    this.touch();
  }

}
