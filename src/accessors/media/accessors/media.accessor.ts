import { Injectable } from '@nestjs/common';
import { Accessor } from '@core/mixins/accessor.mixin';
import { Media } from '../entities/media.entity';

@Injectable()
export class MediaAccessor extends Accessor(Media) {
  // Basic CRUD inherited
}
