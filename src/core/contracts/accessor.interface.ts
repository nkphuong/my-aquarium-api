/**
 * Generic accessor (repository) interface
 * All accessors implement this base interface
 */
export interface IBaseAccessor<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
}
