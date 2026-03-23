import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  defaults: {
    guard: 'user',
  },
  guards: {
    user: {
      provider: 'users',
    },
    admin: {
      provider: 'admins',
    },
  },
  providers: {
    users: {
      accessorToken: 'IUserAccess',
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expireIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '1h',
      refreshToken: {
        expireIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME || '30d',
      },
    },
    admins: {
      accessorToken: 'IAdminAccess',
      secret: process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET,
      expireIn: process.env.JWT_ADMIN_ACCESS_TOKEN_EXPIRATION_TIME || '1h',
      refreshToken: {
        expireIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRATION_TIME || '30d',
      },
    },
  },
}));
