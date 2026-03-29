import { Package } from '../entities/package.entity';
import { PackageFeature } from '../entities/package-feature.entity';

export interface SetFeatureDto {
  featureKey: string;
  value: string;
}

export interface IPackageAdminManager {
  createPackage(dto: {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
  }): Promise<Package>;
  updatePackage(
    id: number,
    dto: {
      name?: string;
      description?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ): Promise<Package>;
  deletePackage(id: number): Promise<void>;
  listPackages(): Promise<Package[]>;
  setPackageFeatures(
    packageId: number,
    features: SetFeatureDto[],
  ): Promise<PackageFeature[]>;
  getPackageFeatures(packageId: number): Promise<PackageFeature[]>;
}

export const PACKAGE_ADMIN_MANAGER = Symbol('IPackageAdminManager');
