export enum TankType {
  FRESHWATER = 'freshwater',
  SALTWATER = 'saltwater',
  PLANTED = 'planted',
  REEF = 'reef',
}

export interface TankDimensions {
  length: number;
  width: number;
  height: number;
}
