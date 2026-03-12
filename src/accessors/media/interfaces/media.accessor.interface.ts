import { IBaseAccessor } from '../../../core/contracts/accessor.interface';
import { Media } from '@entities/media.entity';
export const MEDIA_ACCESSOR = 'MEDIA_ACCESSOR';
export interface IMediaAccessor extends IBaseAccessor<Media> {}
