import { Injectable } from '@nestjs/common';
import { Media } from '../entities/media.entity';
import { BaseDbAccessor } from '@core/accessors/base-db.accessor';
import type { IMediaAccessor } from '../contracts/media.accessor.interface';

@Injectable()
export class MediaAccessor extends BaseDbAccessor implements IMediaAccessor {
  async findById(id: number): Promise<Media | null> {
    return this.em.findOne(Media, { id });
  }

  async findAll(): Promise<Media[]> {
    return this.em.find(Media, {});
  }

  async save(media: Media): Promise<Media> {
    await this.em.persist(media).flush();
    return media;
  }

  async delete(id: number): Promise<void> {
    const media = await this.em.findOne(Media, { id });
    if (media) {
      await this.em.remove(media).flush();
    }
  }
}
