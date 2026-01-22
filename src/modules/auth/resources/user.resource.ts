import { BaseResource } from '@core/resources/base.resource';
import { User } from '../entities/user.entity';

export class UserResource extends BaseResource<User> {
    toJSON(): Record<string, any> {
        return {
            id: this.resource.id,
            email: this.resource.email,
            fullname: this.resource.fullname,
            createdAt: this.resource.createdAt,
            updatedAt: this.resource.updatedAt,
        };
    }
}
