import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Media } from './entities/media.entity';
import { MediaAccessor } from './accessors/media.accessor';
import { MEDIA_ACCESSOR } from './accessors/media.accessor.interface';

@Module({
  imports: [MikroOrmModule.forFeature([Media])],
  providers: [
    {
      provide: MEDIA_ACCESSOR,
      useClass: MediaAccessor,
    },
  ],
  exports: [MEDIA_ACCESSOR],
})
export class MediaAccessorModule {}
