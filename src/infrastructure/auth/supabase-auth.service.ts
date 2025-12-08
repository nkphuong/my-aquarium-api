import { Injectable } from '@nestjs/common';
import { SupabaseService } from '@supabase/supabase.service';
import { AuthResult, SupabaseUser } from './auth.types';
import {
  AuthenticationException,
  UnauthorizedException,
  TokenExpiredException,
} from '@domain/exceptions/auth.exception';

@Injectable()
export class SupabaseAuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signUp(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signUp({ email, password });

    if (error || !data.user || !data.session) {
      throw new AuthenticationException(
        error?.message || 'Registration failed',
      );
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        user_metadata: data.user.user_metadata,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600,
      },
    };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (error || !data.user || !data.session) {
      throw new AuthenticationException(error?.message || 'Login failed');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        user_metadata: data.user.user_metadata,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600,
      },
    };
  }

  async verifyToken(token: string): Promise<SupabaseUser> {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.getUser(token);

    if (error) {
      if (error.message.includes('expired')) {
        throw new TokenExpiredException();
      }
      throw new UnauthorizedException(error.message);
    }

    if (!data.user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      user_metadata: data.user.user_metadata,
    };
  }

  async signOut(token: string): Promise<void> {
    await this.supabaseService.getClient().auth.signOut();
  }
}
