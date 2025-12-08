import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  private _authId: string;
  private _fullname?: string;

  constructor(
    id: number,
    authId: string,
    fullname?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._authId = authId;
    this._fullname = fullname;
  }

  get authId(): string {
    return this._authId;
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
