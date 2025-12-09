import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  private _auth_id: string;
  private _fullname?: string;

  constructor(
    id: number,
    auth_id: string,
    fullname?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._auth_id = auth_id;
    this._fullname = fullname;
  }

  get auth_id(): string {
    return this._auth_id;
  }



  get fullname(): string | undefined {
    return this._fullname;
  }


  updateProfile(fullname?: string): void {
    this._fullname = fullname;
    this.touch();
  }

  // Business rule: Email cannot be changed directly (managed by Supabase Auth)
}
