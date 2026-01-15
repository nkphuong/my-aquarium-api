import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  private _email: string;
  private _password?: string;
  private _fullname?: string;
  private _refreshTokenHash?: string;

  constructor(
    id: number,
    email: string,
    password?: string,
    fullname?: string,
    refreshTokenHash?: string,
    created_at?: Date,
    updated_at?: Date,
  ) {
    super(id, created_at, updated_at);
    this._email = email;
    this._password = password;
    this._fullname = fullname;
    this._refreshTokenHash = refreshTokenHash;
  }

  get email(): string {
    return this._email;
  }

  get password(): string | undefined {
    return this._password;
  }

  get fullname(): string | undefined {
    return this._fullname;
  }

  get refreshTokenHash(): string | undefined {
    return this._refreshTokenHash;
  }

  updateRefreshToken(hash: string | null) {
    this._refreshTokenHash = hash || undefined;
  }
}
