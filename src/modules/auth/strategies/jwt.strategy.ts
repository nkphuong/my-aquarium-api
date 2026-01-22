import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthManager } from '@modules/auth/managers/auth.manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authManager: AuthManager) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey', // TODO: Move to .env for production
        });
    }

    async validate(payload: any) {
        // Passport automatically verifies signature and expiration
        // We just need to return the user
        return this.authManager.validateToken(payload);
    }
}
