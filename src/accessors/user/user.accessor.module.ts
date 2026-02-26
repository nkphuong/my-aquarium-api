import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserAccessor } from './accessors/user.accessor';
import { USER_ACCESSOR } from './accessors/user.accessor.interface';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [
    {
      provide: USER_ACCESSOR,
      useClass: UserAccessor,
    },
  ],
  exports: [USER_ACCESSOR],
})
export class UserAccessorModule {}
