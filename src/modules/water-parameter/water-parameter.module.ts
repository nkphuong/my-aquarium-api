import { Module } from '@nestjs/common';
import { WaterParameterController } from './controllers/water-parameter.controller';
import { WaterParameterManager } from './managers/water-parameter.manager';
import { WaterParameterAccessor } from './accessors/water-parameter.accessor';
import { WATER_PARAMETER_ACCESSOR } from './accessors/water-parameter.accessor.interface';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [WaterParameterController],
    providers: [
        WaterParameterManager,
        {
            provide: WATER_PARAMETER_ACCESSOR,
            useClass: WaterParameterAccessor,
        },
    ],
    exports: [WATER_PARAMETER_ACCESSOR, WaterParameterManager],
})
export class WaterParameterModule { }
