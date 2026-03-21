import { registerAs } from '@nestjs/config';

export default registerAs('service', () => ({
  queue: {
    provider: 'bullmq',
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '', 10) || 6379,
  },
}));
