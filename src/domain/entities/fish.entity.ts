import { BaseEntity } from './base.entity';

export class Fish extends BaseEntity {
  private _name: string;
  private _species: string;
  private _tankId?: number;

  constructor(
    id: number,
    name: string,
    species: string,
    tankId?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._name = name;
    this._species = species;
    this._tankId = tankId;
  }

  get name(): string {
    return this._name;
  }

  get species(): string {
    return this._species;
  }

  get tankId(): number | undefined {
    return this._tankId;
  }

  updateName(name: string): void {
    this._name = name;
    this.touch();
  }

  updateSpecies(species: string): void {
    this._species = species;
    this.touch();
  }
  assignToTank(tankId: number): void {
    this._tankId = tankId;
    this.touch();
  }

  removeFromTank(): void {
    this._tankId = undefined;
    this.touch();
  }


}
