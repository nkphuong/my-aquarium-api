import { Injectable, Inject } from '@nestjs/common';
import type {
  IPackageAdminManager,
  SetFeatureDto,
} from '../contracts/package-admin.manager.interface';
import type { IPackageAccessor } from '../contracts/package.accessor.interface';
import { PACKAGE_ACCESSOR } from '../contracts/package.accessor.interface';
import type { IPackageFeatureAccessor } from '../contracts/package-feature.accessor.interface';
import { PACKAGE_FEATURE_ACCESSOR } from '../contracts/package-feature.accessor.interface';
import { Package } from '../entities/package.entity';
import { PackageFeature } from '../entities/package-feature.entity';
import { PackageNotFoundException } from '../exceptions/package-not-found.exception';

@Injectable()
export class PackageAdminManager implements IPackageAdminManager {
  constructor(
    @Inject(PACKAGE_ACCESSOR)
    private readonly packageAccessor: IPackageAccessor,
    @Inject(PACKAGE_FEATURE_ACCESSOR)
    private readonly packageFeatureAccessor: IPackageFeatureAccessor,
  ) {}

  async createPackage(dto: {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
  }): Promise<Package> {
    const pkg = new Package();
    pkg.fill({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sortOrder: dto.sortOrder ?? 0,
      isActive: true,
    } as any);
    return this.packageAccessor.save(pkg);
  }

  async updatePackage(
    id: number,
    dto: {
      name?: string;
      description?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ): Promise<Package> {
    const pkg = await this.packageAccessor.findById(id);
    if (!pkg) throw new PackageNotFoundException(id);

    pkg.fill(dto as any);
    return this.packageAccessor.update(id, pkg);
  }

  async deletePackage(id: number): Promise<void> {
    const pkg = await this.packageAccessor.findById(id);
    if (!pkg) throw new PackageNotFoundException(id);
    await this.packageFeatureAccessor.deleteByPackageId(id);
    await this.packageAccessor.delete(id);
  }

  async listPackages(): Promise<Package[]> {
    return this.packageAccessor.findAll();
  }

  async setPackageFeatures(
    packageId: number,
    features: SetFeatureDto[],
  ): Promise<PackageFeature[]> {
    const pkg = await this.packageAccessor.findById(packageId);
    if (!pkg) throw new PackageNotFoundException(packageId);

    await this.packageFeatureAccessor.deleteByPackageId(packageId);

    const saved: PackageFeature[] = [];
    for (const dto of features) {
      const feature = new PackageFeature();
      feature.fill({
        package: pkg,
        featureKey: dto.featureKey,
        value: dto.value,
      } as any);
      saved.push(await this.packageFeatureAccessor.save(feature));
    }

    return saved;
  }

  async getPackageFeatures(packageId: number): Promise<PackageFeature[]> {
    const pkg = await this.packageAccessor.findById(packageId);
    if (!pkg) throw new PackageNotFoundException(packageId);
    return this.packageFeatureAccessor.findByPackageId(packageId);
  }
}
