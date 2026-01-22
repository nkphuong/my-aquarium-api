import { User } from '../entities/user.entity';

export interface IUserAccessor {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    updateRefreshToken(id: number, refreshTokenHash: string | null): Promise<User>;
    delete(id: number): Promise<void>;
}

export const USER_ACCESSOR = Symbol('IUserAccessor');
