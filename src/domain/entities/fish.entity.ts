import { BaseEntity } from './base.entity';

export class Fish extends BaseEntity {
  private _name: string;
  private _species: string;

  constructor(
    id: number,
    name: string,
    species: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._name = name;
    this._species = species;
  }

  get name(): string {
    return this._name;
  }

  get species(): string {
    return this._species;
  }


  updateName(name: string): void {
    this._name = name;
    this.touch();
  }

  updateSpecies(species: string): void {
    this._species = species;
    this.touch();
  }



}
