import { Module, Global } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Tank } from './tank.entity';
import { WaterParameter } from './water-parameter.entity';
import { Fish } from './fish.entity';
import { FishSpecies } from './fish-species.entity';
import { Livestock } from './livestock.entity';
import { Media } from './media.entity';
import { User } from './user.entity';

const ENTITIES = [
    Tank,
    WaterParameter,
    Fish,
    FishSpecies,
    Livestock,
    Media,
    User,
];

@Global()
@Module({
    imports: [MikroOrmModule.forFeature(ENTITIES)],
    exports: [MikroOrmModule],
})
export class EntitiesModule { }
