import { PackageFeature } from '../entities/package-feature.entity';

export interface IPackageFeatureAccessor {
  findByPackageId(packageId: number): Promise<PackageFeature[]>;
  save(feature: PackageFeature): Promise<PackageFeature>;
  deleteByPackageId(packageId: number): Promise<void>;
  delete(id: number): Promise<void>;
}

export const PACKAGE_FEATURE_ACCESSOR = Symbol('IPackageFeatureAccessor');
