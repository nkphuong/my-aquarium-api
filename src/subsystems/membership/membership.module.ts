import { Module } from '@nestjs/common';
import { UtilitiesModule } from '@utilities/utility.module';
import { AccountManager } from './managers/account.manager';
import { SessionManager } from './managers/session.manager';
import { MemberAccess } from './accessors/member.access';
import { UserTokenAccess } from './accessors/user-token.access';

@Module({
  imports: [UtilitiesModule],
  providers: [
    { provide: 'IAccountManager', useClass: AccountManager },
    { provide: 'ISessionManager', useClass: SessionManager },
    // Internal — not exported (subsystem boundary enforcement)
    { provide: 'IMemberAccess', useClass: MemberAccess },
    { provide: 'IUserTokenAccess', useClass: UserTokenAccess },
  ],
  exports: ['IAccountManager', 'ISessionManager'],
})
export class MembershipModule {}
