import { BaseResource } from '@core/resources/base.resource';
import { WaterParameter } from '@accessors/aquarium/entities/water-parameter.entity';

export class WaterParameterResource extends BaseResource<WaterParameter> {
  toJSON(): Record<string, any> {
    return {
      id: this.resource.id,
      tankId: this.resource.tank_id,
      testedAt: this.resource.tested_at,
      temperature: this.resource.temperature,
      ph: this.resource.ph,
      ammonia: this.resource.ammonia,
      nitrite: this.resource.nitrite,
      nitrate: this.resource.nitrate,
      gh: this.resource.gh,
      kh: this.resource.kh,
      notes: this.resource.notes,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    };
  }
}
