import { Package } from '../entities/package.entity';

export interface IPackageAccessor {
  findById(id: number): Promise<Package | null>;
  findBySlug(slug: string): Promise<Package | null>;
  findAll(): Promise<Package[]>;
  findAllActive(): Promise<Package[]>;
  save(pkg: Package): Promise<Package>;
  update(id: number, pkg: Package): Promise<Package>;
  delete(id: number): Promise<void>;
}

export const PACKAGE_ACCESSOR = Symbol('IPackageAccessor');
