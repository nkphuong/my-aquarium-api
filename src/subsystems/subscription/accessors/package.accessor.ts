import { Injectable } from '@nestjs/common';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import { Package } from '../entities/package.entity';
import type { IPackageAccessor } from '../contracts/package.accessor.interface';

@Injectable()
export class PackageAccessor
  extends BaseDbAccessor
  implements IPackageAccessor
{
  async findById(id: number): Promise<Package | null> {
    return this.em.findOne(Package, { id });
  }

  async findBySlug(slug: string): Promise<Package | null> {
    return this.em.findOne(Package, { slug });
  }

  async findAll(): Promise<Package[]> {
    return this.em.find(Package, {}, { orderBy: { sortOrder: 'ASC' } });
  }

  async findAllActive(): Promise<Package[]> {
    return this.em.find(
      Package,
      { isActive: true },
      { orderBy: { sortOrder: 'ASC' } },
    );
  }

  async save(pkg: Package): Promise<Package> {
    await this.em.persist(pkg).flush();
    return pkg;
  }

  async update(id: number, pkg: Package): Promise<Package> {
    this.em.assign(pkg, { id });
    await this.em.flush();
    return pkg;
  }

  async delete(id: number): Promise<void> {
    const pkg = await this.em.findOne(Package, { id });
    if (pkg) {
      await this.em.remove(pkg).flush();
    }
  }
}
