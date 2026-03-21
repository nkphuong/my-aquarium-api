import { Media } from '../entities/media.entity';

export const MEDIA_ACCESSOR = 'MEDIA_ACCESSOR';

export interface IMediaAccessor {
  findById(id: number): Promise<Media | null>;
  findAll(): Promise<Media[]>;
  save(media: Media): Promise<Media>;
  delete(id: number): Promise<void>;
}
