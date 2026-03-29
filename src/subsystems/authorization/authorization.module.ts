import { Module } from '@nestjs/common';
import { UtilitiesModule } from '@utilities/utility.module';

import { RoleAccessor } from './accessors/role.accessor';
import { PermissionAccessor } from './accessors/permission.accessor';
import { AdminRoleAccessor } from './accessors/admin-role.accessor';

import { PermissionEngine } from './engines/permission.engine';

import { AuthorizationManager } from './managers/authorization.manager';

import { ROLE_ACCESSOR } from './contracts/role.accessor.interface';
import { PERMISSION_ACCESSOR } from './contracts/permission.accessor.interface';
import { ADMIN_ROLE_ACCESSOR } from './contracts/admin-role.accessor.interface';
import { AUTHORIZATION_MANAGER } from './contracts/authorization.manager.interface';

@Module({
  imports: [UtilitiesModule],
  providers: [
    // Accessors — internal
    { provide: ROLE_ACCESSOR, useClass: RoleAccessor },
    { provide: PERMISSION_ACCESSOR, useClass: PermissionAccessor },
    { provide: ADMIN_ROLE_ACCESSOR, useClass: AdminRoleAccessor },

    // Engine — pure logic
    PermissionEngine,

    // Manager — exported public API
    { provide: AUTHORIZATION_MANAGER, useClass: AuthorizationManager },
  ],
  exports: [AUTHORIZATION_MANAGER],
})
export class AuthorizationModule {}
