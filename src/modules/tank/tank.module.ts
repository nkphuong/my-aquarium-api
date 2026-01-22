import { Module } from '@nestjs/common';
import { TankController } from './controllers/tank.controller';
import { TankManager } from './managers/tank.manager';
import { TankAccessor } from './accessors/tank.accessor';
import { TANK_ACCESSOR } from './accessors/tank.accessor.interface';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TankController],
  providers: [
    TankManager,
    {
      provide: TANK_ACCESSOR,
      useClass: TankAccessor,
    },
  ],
  exports: [TANK_ACCESSOR, TankManager],
})
export class TankModule { }
