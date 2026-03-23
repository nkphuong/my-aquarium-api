import { Module } from '@nestjs/common';
import { UtilitiesModule } from '@utilities/utility.module';
import { AccountManager } from './managers/account.manager';
import { SessionManager } from './managers/session.manager';
import { UserAccess } from './accessors/user.access';
import { AdminAccess } from './accessors/admin.access';
import { UserTokenAccess } from './accessors/user-token.access';
import type { IAuthAccess } from './contracts/auth.access.interface';

@Module({
  imports: [UtilitiesModule],
  providers: [
    { provide: 'IAccountManager', useClass: AccountManager },
    { provide: 'ISessionManager', useClass: SessionManager },
    // Internal — not exported (subsystem boundary enforcement)
    { provide: 'IUserAccess', useClass: UserAccess },
    { provide: 'IAdminAccess', useClass: AdminAccess },
    { provide: 'IUserTokenAccess', useClass: UserTokenAccess },
    {
      provide: 'AUTH_ACCESSORS',
      useFactory: (user: IAuthAccess, admin: IAuthAccess) =>
        new Map<string, IAuthAccess>([
          ['user', user],
          ['admin', admin],
        ]),
      inject: ['IUserAccess', 'IAdminAccess'],
    },
  ],
  exports: ['IAccountManager', 'ISessionManager'],
})
export class MembershipModule {}
