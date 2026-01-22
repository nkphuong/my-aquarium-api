import { Module } from '@nestjs/common';
import { LivestockController } from './controllers/livestock.controller';
import { LivestockManager } from './managers/livestock.manager';
import { LivestockAccessor } from './accessors/livestock.accessor';
import { LIVESTOCK_ACCESSOR } from './accessors/livestock.accessor.interface';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [LivestockController],
    providers: [
        LivestockManager,
        {
            provide: LIVESTOCK_ACCESSOR,
            useClass: LivestockAccessor,
        },
    ],
    exports: [LIVESTOCK_ACCESSOR, LivestockManager],
})
export class LivestockModule { }
