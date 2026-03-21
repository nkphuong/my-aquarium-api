import { Livestock } from '../entities/livestock.entity';

export interface ILivestockAccessor {
  findById(id: number): Promise<Livestock | null>;
  findByTankId(tankId: number): Promise<Livestock[]>;
  save(livestock: Livestock): Promise<Livestock>;
  update(id: number, livestock: Livestock): Promise<Livestock>;
  delete(id: number): Promise<void>;
}

export const LIVESTOCK_ACCESSOR = Symbol('ILivestockAccessor');
