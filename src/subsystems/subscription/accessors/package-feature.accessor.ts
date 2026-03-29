import { Injectable } from '@nestjs/common';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { PackageFeature } from '../entities/package-feature.entity';
import type { IPackageFeatureAccessor } from '../contracts/package-feature.accessor.interface';

@Injectable()
export class PackageFeatureAccessor
  extends BaseDbAccessor
  implements IPackageFeatureAccessor
{
  async findByPackageId(packageId: number): Promise<PackageFeature[]> {
    return this.em.find(PackageFeature, { package: { id: packageId } });
  }

  async save(feature: PackageFeature): Promise<PackageFeature> {
    await this.em.persist(feature).flush();
    return feature;
  }

  async deleteByPackageId(packageId: number): Promise<void> {
    const features = await this.em.find(PackageFeature, {
      package: { id: packageId },
    });
    await this.em.remove(features).flush();
  }

  async delete(id: number): Promise<void> {
    const feature = await this.em.findOne(PackageFeature, { id });
    if (feature) {
      await this.em.remove(feature).flush();
    }
  }
}
