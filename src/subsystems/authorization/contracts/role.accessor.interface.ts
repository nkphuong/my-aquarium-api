import { Role } from '../entities/role.entity';

export interface IRoleAccessor {
  findById(id: number): Promise<Role | null>;
  findBySlug(slug: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  findWithPermissions(id: number): Promise<Role | null>;
  save(role: Role): Promise<Role>;
  update(id: number, role: Role): Promise<Role>;
  delete(id: number): Promise<void>;
}

export const ROLE_ACCESSOR = Symbol('IRoleAccessor');
