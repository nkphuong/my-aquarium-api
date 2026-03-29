import { Module } from '@nestjs/common';
import { UtilitiesModule } from '@utilities/utility.module';

import { PackageAccessor } from './accessors/package.accessor';
import { PackageFeatureAccessor } from './accessors/package-feature.accessor';
import { UserSubscriptionAccessor } from './accessors/user-subscription.accessor';

import { PackageResolutionEngine } from './engines/package-resolution.engine';

import { SubscriptionManager } from './managers/subscription.manager';
import { PackageAdminManager } from './managers/package-admin.manager';

import { PACKAGE_ACCESSOR } from './contracts/package.accessor.interface';
import { PACKAGE_FEATURE_ACCESSOR } from './contracts/package-feature.accessor.interface';
import { USER_SUBSCRIPTION_ACCESSOR } from './contracts/user-subscription.accessor.interface';
import { SUBSCRIPTION_MANAGER } from './contracts/subscription.manager.interface';
import { PACKAGE_ADMIN_MANAGER } from './contracts/package-admin.manager.interface';

@Module({
  imports: [UtilitiesModule],
  providers: [
    // Accessors — internal, not exported
    { provide: PACKAGE_ACCESSOR, useClass: PackageAccessor },
    { provide: PACKAGE_FEATURE_ACCESSOR, useClass: PackageFeatureAccessor },
    { provide: USER_SUBSCRIPTION_ACCESSOR, useClass: UserSubscriptionAccessor },

    // Engine — pure logic
    PackageResolutionEngine,

    // Managers — exported public API
    { provide: SUBSCRIPTION_MANAGER, useClass: SubscriptionManager },
    { provide: PACKAGE_ADMIN_MANAGER, useClass: PackageAdminManager },
  ],
  exports: [SUBSCRIPTION_MANAGER, PACKAGE_ADMIN_MANAGER],
})
export class SubscriptionModule {}
