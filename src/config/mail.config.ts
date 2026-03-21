import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  default: process.env.MAIL_MAILER || 'smtp',
  from: {
    address: process.env.MAIL_FROM_ADDRESS || 'noreply@ai-aggregator.com',
    name: process.env.MAIL_FROM_NAME || 'AI Aggregator',
  },
  mailers: {
    smtp: {
      host: process.env.MAIL_HOST || 'localhost',
      port: parseInt(process.env.MAIL_PORT ?? '', 10) || 1025,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USERNAME || '',
        pass: process.env.MAIL_PASSWORD || '',
      },
    },
  },
}));
