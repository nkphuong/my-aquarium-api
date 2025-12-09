export abstract class BaseEntity {
  protected readonly _id: number;
  protected readonly _created_at: Date;
  protected _updated_at: Date;

  constructor(id: number, created_at?: Date, updated_at?: Date) {
    this._id = id;
    this._created_at = created_at || new Date();
    this._updated_at = updated_at || new Date();
  }

  get id(): number {
    return this._id;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date {
    return this._updated_at;
  }

  protected touch(): void {
    this._updated_at = new Date();
  }
}
