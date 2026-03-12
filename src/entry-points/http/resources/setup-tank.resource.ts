import { BaseResource } from '@core/resources/base.resource';

export class SetupTankResource extends BaseResource<any> {
  toJSON(): Record<string, any> {
    return {
      ideas: this.resource.ideas,
      user_id: this.resource.user_id,
    };
  }
}
