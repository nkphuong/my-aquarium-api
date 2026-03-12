import { BaseResource } from '@core/resources/base.resource';
import { Tank } from '@entities/tank.entity';

export class TankResource extends BaseResource<Tank> {
  toJSON(): Record<string, any> {
    return {
      id: this.resource.id,
      name: this.resource.name,
      width: this.resource.width,
      height: this.resource.height,
      length: this.resource.length,
      volume: this.resource.volume_liters,
      type: this.resource.tank_type,
      style: this.resource.style,
      description: this.resource.description,
      substrate: this.resource.substrate,
      filterType: this.resource.filter_type,
      coverImageUrl: this.resource.cover_image_url,
      setupDate: this.resource.setup_date,
      isArchived: this.resource.is_archived,
      userId: this.resource.user_id,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    };
  }
}
