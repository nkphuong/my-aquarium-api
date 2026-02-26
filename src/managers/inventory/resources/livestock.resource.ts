import { BaseResource } from '@core/resources/base.resource';
import { Livestock } from '@accessors/livestock/entities/livestock.entity';

export class LivestockResource extends BaseResource<Livestock> {
  toJSON(): Record<string, any> {
    return {
      id: this.resource.id,
      tankId: this.resource.tank_id,
      name: this.resource.name,
      scientificName: this.resource.scientific_name,
      fishbaseId: this.resource.fishbase_id,
      type: this.resource.type,
      quantity: this.resource.quantity,
      status: this.resource.status,
      imageUrl: this.resource.image_url,
      addedDate: this.resource.added_date,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    };
  }
}
