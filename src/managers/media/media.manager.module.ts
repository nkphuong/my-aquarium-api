import { Module } from '@nestjs/common';
import { MediaManager } from './managers/media.manager';
import { MediaController } from './controllers/media.controller';
import { MediaAccessorModule } from '@accessors/media/media.accessor.module';

@Module({
  imports: [MediaAccessorModule],
  controllers: [MediaController],
  providers: [MediaManager],
  exports: [MediaManager],
})
export class MediaManagerModule {}
